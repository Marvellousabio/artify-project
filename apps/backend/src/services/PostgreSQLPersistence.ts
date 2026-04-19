import { Doc } from 'yjs';
import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pg;

interface DocUpdate {
  id: string;
  docId: string;
  update: Buffer;
  timestamp: Date;
}

export class PostgreSQLPersistence {
  private pool: pg.Pool;
  private updateBuffers: Map<string, Buffer[]> = new Map();
  private saveIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
    });

    this.initializeTables();
  }

  private async initializeTables() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS yjs_doc_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        doc_id VARCHAR(255) NOT NULL,
        update_data BYTEA NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        INDEX idx_doc_id_timestamp (doc_id, timestamp)
      );

      CREATE TABLE IF NOT EXISTS yjs_docs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        doc_id VARCHAR(255) UNIQUE NOT NULL,
        snapshot BYTEA,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    try {
      await this.pool.query(createTableQuery);
      console.log('Yjs persistence tables initialized');
    } catch (error) {
      console.error('Failed to initialize Yjs persistence tables:', error);
    }
  }

  // Bind to a Y.Doc to automatically persist changes
  bindDoc(doc: Doc, docId: string) {
    // Load existing snapshot
    this.loadDoc(doc, docId);

    // Set up update handler
    const updateHandler = (update: Uint8Array, origin: any) => {
      // Skip updates from persistence loading
      if (origin === 'persistence') return;

      this.storeUpdate(docId, Buffer.from(update));
    };

    doc.on('update', updateHandler);

    // Set up periodic save
    const saveInterval = setInterval(() => {
      this.flushUpdates(docId);
    }, 5000); // Save every 5 seconds

    this.saveIntervals.set(docId, saveInterval);

    // Return cleanup function
    return () => {
      doc.off('update', updateHandler);
      const interval = this.saveIntervals.get(docId);
      if (interval) {
        clearInterval(interval);
        this.saveIntervals.delete(docId);
      }
      // Final flush
      this.flushUpdates(docId);
    };
  }

  private storeUpdate(docId: string, update: Buffer) {
    const buffer = this.updateBuffers.get(docId) || [];
    buffer.push(update);
    this.updateBuffers.set(docId, buffer);
  }

  private async flushUpdates(docId: string) {
    const updates = this.updateBuffers.get(docId);
    if (!updates || updates.length === 0) return;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert all updates
      const values = updates.map(update => `($1, $2, $3)`).join(', ');
      const params = updates.flatMap(update => [docId, update, new Date()]);

      await client.query(
        `INSERT INTO yjs_doc_updates (doc_id, update_data, timestamp) VALUES ${values}`,
        params
      );

      // Create or update snapshot
      const allUpdates = await this.getAllUpdates(docId);
      const snapshot = Buffer.concat(allUpdates.map(u => u.update));

      await client.query(
        `INSERT INTO yjs_docs (doc_id, snapshot, last_updated)
         VALUES ($1, $2, $3)
         ON CONFLICT (doc_id)
         DO UPDATE SET snapshot = EXCLUDED.snapshot, last_updated = EXCLUDED.last_updated`,
        [docId, snapshot, new Date()]
      );

      await client.query('COMMIT');

      // Clear buffer
      this.updateBuffers.delete(docId);
      console.log(`Persisted ${updates.length} updates for doc ${docId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to persist updates:', error);
    } finally {
      client.release();
    }
  }

  private async loadDoc(doc: Doc, docId: string) {
    try {
      const result = await this.pool.query(
        'SELECT snapshot FROM yjs_docs WHERE doc_id = $1',
        [docId]
      );

      if (result.rows.length > 0 && result.rows[0].snapshot) {
        const snapshot = result.rows[0].snapshot as Buffer;
        // Apply the snapshot to the doc
        doc.transact(() => {
          try {
            // In a real implementation, you'd need to properly decode and apply the Yjs updates
            // This is a simplified version - you'd need to reconstruct the full state
            console.log(`Loaded snapshot for doc ${docId} (${snapshot.length} bytes)`);
          } catch (error) {
            console.error('Failed to apply snapshot:', error);
          }
        }, 'persistence');
      }
    } catch (error) {
      console.error('Failed to load doc:', error);
    }
  }

  private async getAllUpdates(docId: string): Promise<DocUpdate[]> {
    try {
      const result = await this.pool.query(
        'SELECT id, doc_id, update_data, timestamp FROM yjs_doc_updates WHERE doc_id = $1 ORDER BY timestamp ASC',
        [docId]
      );

      return result.rows.map(row => ({
        id: row.id,
        docId: row.doc_id,
        update: row.update_data,
        timestamp: row.timestamp,
      }));
    } catch (error) {
      console.error('Failed to get updates:', error);
      return [];
    }
  }

  // Get full document state for reconnection
  async getFullDoc(docId: string): Promise<Buffer | null> {
    try {
      const result = await this.pool.query(
        'SELECT snapshot FROM yjs_docs WHERE doc_id = $1',
        [docId]
      );

      return result.rows.length > 0 ? result.rows[0].snapshot : null;
    } catch (error) {
      console.error('Failed to get full doc:', error);
      return null;
    }
  }

  async close() {
    // Flush all pending updates
    for (const docId of this.updateBuffers.keys()) {
      await this.flushUpdates(docId);
    }

    // Clear all intervals
    for (const interval of this.saveIntervals.values()) {
      clearInterval(interval);
    }

    await this.pool.end();
  }
}

// Singleton instance
let persistenceInstance: PostgreSQLPersistence | null = null;

export function getPersistence(): PostgreSQLPersistence {
  if (!persistenceInstance) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/artify';
    persistenceInstance = new PostgreSQLPersistence(connectionString);
  }
  return persistenceInstance;
}