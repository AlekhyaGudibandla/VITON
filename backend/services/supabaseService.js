const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase credentials not set. Some features will not work.');
}

const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Upload file to Supabase Storage
async function uploadToStorage(bucket, filePath, fileBuffer, contentType) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true
    });

  if (error) throw error;
  return data;
}

// Get a signed URL for a file (works with private buckets)
async function getSignedUrl(bucket, filePath, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

// Get public URL for a file (only works if bucket is public)
function getPublicUrl(bucket, filePath) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Try signed URL first, fall back to public URL
async function getImageUrl(bucket, filePath) {
  try {
    return await getSignedUrl(bucket, filePath, 7200); // 2 hour expiry
  } catch {
    return getPublicUrl(bucket, filePath);
  }
}

// Generate a proxy URL pointing to our backend image proxy
// This is the most reliable method — works with private buckets and avoids CORS
function getProxyUrl(bucket, filePath) {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
  return `${backendUrl}/api/images/${bucket}/${filePath}`;
}

// Download file from storage
async function downloadFromStorage(bucket, filePath) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(filePath);

  if (error) throw error;
  return data;
}

// Delete file from storage
async function deleteFromStorage(bucket, filePath) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;
}

// Insert record into a table
async function insertRecord(table, record) {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update record in a table
async function updateRecord(table, id, updates) {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get records from a table
async function getRecords(table, filters = {}, orderBy = 'created_at', ascending = false) {
  let query = supabase.from(table).select('*');

  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });

  query = query.order(orderBy, { ascending });

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Get single record
async function getRecord(table, id) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  uploadToStorage,
  getSignedUrl,
  getPublicUrl,
  getImageUrl,
  getProxyUrl,
  downloadFromStorage,
  deleteFromStorage,
  insertRecord,
  updateRecord,
  getRecords,
  getRecord
};
