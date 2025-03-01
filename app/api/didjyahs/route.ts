// app/api/didjyahs/route.js

import { turso } from "@/lib/turso";
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Opt into the Edge runtime (if supported by your dependencies)
export const runtime = 'edge';

// GET handler to fetch didjyahs for the current user only
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const result = await turso.execute({
      sql: 'SELECT * FROM didjyahs WHERE user_id = ?',
      args: [user.id]
    });
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching didjyahs:', error);
    return NextResponse.json({ error: 'Failed to fetch didjyahs' }, { status: 500 });
  }
}

// POST handler to add a new record to the didjyahs table for the current user
export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }
    const result = await turso.execute({
      sql: 'INSERT INTO didjyahs (name, user_id, created_at) VALUES (?, ?, ?)',
      args: [body.name, user.id, new Date().toISOString()]
    });
    return NextResponse.json(
      { 
        message: 'Record created successfully',
        id: result.lastInsertRowid 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating didjyah:', error);
    return NextResponse.json({ error: 'Failed to create didjyah' }, { status: 500 });
  }
}

// PUT handler to update a record in the didjyahs table for the current user only
export async function PUT(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Build the update query based on provided fields
    const updateFields = [];
    const args = [];
    
    if (body.name !== undefined) {
      updateFields.push('name = ?');
      args.push(body.name);
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Add the updated_at timestamp
    updateFields.push('updated_at = ?');
    args.push(new Date().toISOString());
    
    // Add the id and user_id to args for the WHERE clause
    args.push(body.id, user.id);
    
    const result = await turso.execute({
      sql: `UPDATE didjyahs SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
      args
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Record not found or not owned by current user' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Record updated successfully',
      rowsAffected: result.rowsAffected
    });
  } catch (error) {
    console.error('Error updating didjyah:', error);
    return NextResponse.json({ error: 'Failed to update didjyah' }, { status: 500 });
  }
}

// DELETE handler to delete a record from the didjyahs table for the current user only
export async function DELETE(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const result = await turso.execute({
      sql: 'DELETE FROM didjyahs WHERE id = ? AND user_id = ?',
      args: [id, user.id]
    });
    
    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: 'Record not found or not owned by current user' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Record deleted successfully',
      rowsAffected: result.rowsAffected
    });
  } catch (error) {
    console.error('Error deleting didjyah:', error);
    return NextResponse.json({ error: 'Failed to delete didjyah' }, { status: 500 });
  }
}
