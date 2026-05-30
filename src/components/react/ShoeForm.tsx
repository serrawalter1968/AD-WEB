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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3d3d3d] tracking-tight">{isEdit ? 'Editar producto' : 'Agregar producto'}</h1>
        <p className="text-sm text-[#b5a5a5] font-light mt-1">Completá los datos del producto</p>
      </div>

      {error && (
        <div className="bg-[#f5ecec] text-[#c9a8a8] p-3.5 rounded-lg mb-6 text-sm font-medium border border-[#f0e4e0]">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-[#f0ebe7] space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#7a6a6a] mb-1.5 tracking-wide">Nombre *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            className="w-full px-3.5 py-2.5 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] placeholder:text-[#d4c5c5] transition-colors duration-150"
            placeholder="Ej: Stiletto Clásico"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7a6a6a] mb-1.5 tracking-wide">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            className="w-full px-3.5 py-2.5 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] placeholder:text-[#d4c5c5] transition-colors duration-150 resize-none"
            placeholder="Descripción del producto..."
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#7a6a6a] mb-1.5 tracking-wide">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] transition-colors duration-150"
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
            <label className="block text-sm font-medium text-[#7a6a6a] mb-1.5 tracking-wide">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] placeholder:text-[#d4c5c5] transition-colors duration-150"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7a6a6a] mb-1.5 tracking-wide">Cantidad en stock *</label>
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            required
            className="w-full px-3.5 py-2.5 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] placeholder:text-[#d4c5c5] transition-colors duration-150"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7a6a6a] mb-1.5 tracking-wide">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-sm text-[#b5a5a5] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#f5ecec] file:text-[#c9a8a8] hover:file:bg-[#f0e4e0] cursor-pointer transition-colors duration-150"
          />
          {uploading && <p className="text-sm text-[#b5a5a5] mt-1.5 font-light">Subiendo imagen...</p>}
          {form.image_url && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-[#faf7f5] rounded-lg border border-[#f0ebe7]">
              <img src={form.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
              <span className="text-xs text-[#b5a5a5] truncate max-w-[280px] font-light">{form.image_url}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#f0ebe7]">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-[#c9a8a8] hover:bg-[#b89292] text-white px-6 py-2.5 rounded-lg disabled:opacity-50 cursor-pointer font-medium transition-colors duration-200 shadow-sm"
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Agregar producto'}
          </button>
          <a
            href="/admin"
            className="bg-[#f5f0ee] text-[#7a6a6a] px-6 py-2.5 rounded-lg hover:bg-[#f0ebe7] text-center font-medium transition-colors duration-150"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
