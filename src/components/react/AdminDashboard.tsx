import { useState, useEffect } from 'react';

type Shoe = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
  created_at: string;
};

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock de Calzado</h1>
        <a
          href="/admin/add"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm font-medium"
        >
          + Agregar producto
        </a>
      </div>

      {shoes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay productos. ¡Agregá el primero!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Imagen</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Categoría</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {shoes.map((shoe) => (
                <tr key={shoe.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {shoe.image_url ? (
                      <img src={shoe.image_url} alt={shoe.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{shoe.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{shoe.category || '-'}</td>
                  <td className="px-4 py-3">${Number(shoe.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${shoe.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {shoe.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <a
                      href={`/admin/edit/${shoe.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Editar
                    </a>
                    <button
                      onClick={() => handleDelete(shoe.id)}
                      className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                    >
                      Eliminar
                    </button>
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
