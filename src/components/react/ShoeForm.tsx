import { useState } from 'react';

type ShoeFormData = {
  name: string;
  description: string;
  category: string;
  price: string;
  quantity: string;
  image_url: string;
};

interface Props {
  initialData?: ShoeFormData & { id?: number };
}

export default function ShoeForm({ initialData }: Props) {
  const isEdit = !!initialData?.id;
  const [form, setForm] = useState<ShoeFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    quantity: initialData?.quantity || '',
    image_url: initialData?.image_url || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    const formData = new FormData();
    formData.append('file', f);

    setUploading(true);
    setError('');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al subir imagen');
        return;
      }
      const data = await res.json();
      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch {
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/shoes/${initialData.id}` : '/api/shoes';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          price: parseFloat(form.price) || 0,
          quantity: parseInt(form.quantity) || 0,
          image_url: form.image_url,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al guardar');
        return;
      }

      window.location.href = '/admin';
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Editar producto' : 'Agregar producto'}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            >
              <option value="">Seleccionar</option>
              <option value="Zapatos">Zapatos</option>
              <option value="Zapatillas">Zapatillas</option>
              <option value="Botas">Botas</option>
              <option value="Sandalias">Sandalias</option>
              <option value="Tacos">Tacos</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad en stock *</label>
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo imagen...</p>}
          {form.image_url && (
            <div className="mt-2 flex items-center gap-2">
              <img src={form.image_url} alt="Preview" className="w-16 h-16 object-cover rounded" />
              <span className="text-xs text-gray-500 truncate max-w-[200px]">{form.image_url}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 cursor-pointer font-medium"
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Agregar producto'}
          </button>
          <a
            href="/admin"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-center font-medium"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
