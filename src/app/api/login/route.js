import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});

export default pool;

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const userResult = await pool.query(
      "SELECT nrp, nama FROM usernilai WHERE password = $1",
      [password]
    );

    if (userResult.rowCount === 0) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const user = userResult.rows[0];

    const gradesResult = await pool.query(
      "SELECT kriteria, judulkriteria, grade, bobot FROM nilai WHERE nrp = $1 ORDER BY idnilai ASC",
      [user.nrp]
    );

    return NextResponse.json({
      user,
      grades: gradesResult.rows,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
