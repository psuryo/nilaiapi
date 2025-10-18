import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,          // or '127.0.0.1'
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,                 // adjust if needed
  ssl: false,                   // set to true if using SSL
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing student ID' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'SELECT kriteria, judulkriteria, grade FROM nilai WHERE nrp = $1 order by idnilai asc',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
