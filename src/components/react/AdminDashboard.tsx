import { useState, useEffect } from 'react';

type Shoe = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  sizes: Record<string, number>;
  image_url: string;
  created_at: string;
};

function getTotalStock(sizes: Record<string, number>): number {
  return Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
}

export default function AdminDashboard() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShoes = async () => {
    try {
      const res = await fetch('/api/shoes');
      if (res.ok) {
        setShoes(await res.json());
      }
    } catch (e) {
      console.error('Error fetching shoes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás segura de eliminar este producto?')) return;

    const res = await fetch(`/api/shoes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setShoes(shoes.filter((s) => s.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3d3d3d] tracking-tight">Stock de Calzado</h1>
          <p className="text-sm text-[#b5a5a5] font-light mt-1">{shoes.length} producto{shoes.length !== 1 ? 's' : ''} registrado{shoes.length !== 1 ? 's' : ''}</p>
        </div>
        <a
          href="/admin/add"
          className="bg-[#c9a8a8] hover:bg-[#b89292] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
        >
          + Agregar producto
        </a>
      </div>

      {shoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-[#f0ebe7]">
          <p className="text-[#d4c5c5] text-sm font-light">No hay productos. ¡Agregá el primero!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#f0ebe7] shadow-sm">
          <table className="w-full bg-white">
            <thead>
              <tr className="border-b border-[#f0ebe7] bg-[#faf7f5]">
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Imagen</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Nombre</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Categoría</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Precio</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Stock</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {shoes.map((shoe) => (
                <tr key={shoe.id} className="border-b border-[#f0ebe7] hover:bg-[#faf7f5] transition-colors duration-150">
                  <td className="px-4 py-3">
                    {shoe.image_url ? (
                      <img src={shoe.image_url} alt={shoe.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-[#f5f0ee] rounded-md flex items-center justify-center text-[#d4c5c5] text-xs">Sin img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#3d3d3d]">{shoe.name}</td>
                  <td className="px-4 py-3 text-sm text-[#b5a5a5]">{shoe.category || '-'}</td>
                  <td className="px-4 py-3 font-medium text-[#3d3d3d]">${Number(shoe.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${
                        getTotalStock(shoe.sizes) > 10
                          ? 'bg-[#f0ebe7] text-[#7a6a6a]'
                          : getTotalStock(shoe.sizes) > 0
                          ? 'bg-[#f5ecec] text-[#c9a8a8]'
                          : 'bg-[#f5ecec] text-[#d4b5b5]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          getTotalStock(shoe.sizes) > 10
                            ? 'bg-[#9cb4a8]'
                            : getTotalStock(shoe.sizes) > 0
                            ? 'bg-[#e8c9a0]'
                            : 'bg-[#d4c5c5]'
                        }`} />
                        {getTotalStock(shoe.sizes)} uds.
                      </span>
                      {Object.entries(shoe.sizes).filter(([, qty]) => qty > 0).length > 0 && (
                        <span className="text-xs text-[#b5a5a5] font-light">
                          {Object.entries(shoe.sizes)
                            .filter(([, qty]) => qty > 0)
                            .map(([t, q]) => `${t}: ${q}`)
                            .join(' | ')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/admin/edit/${shoe.id}`}
                        className="text-[#b5a5a5] hover:text-[#c9a8a8] text-sm font-medium transition-colors duration-150"
                      >
                        Editar
                      </a>
                      <button
                        onClick={() => handleDelete(shoe.id)}
                        className="text-[#d4c5c5] hover:text-[#c9a8a8] text-sm font-medium transition-colors duration-150 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
