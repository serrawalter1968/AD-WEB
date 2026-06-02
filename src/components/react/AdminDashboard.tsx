import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

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

function QRCell({ shoe }: { shoe: Shoe }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [fullQr, setFullQr] = useState('');

  useEffect(() => {
    const sizesText = Object.entries(shoe.sizes)
      .filter(([, q]) => q > 0)
      .map(([t, q]) => `${t}: ${q}`)
      .join(', ');

    const data = [
      `Producto: ${shoe.name}`,
      `Categoría: ${shoe.category}`,
      `Precio: $${Number(shoe.price).toFixed(2)}`,
      `Stock: ${getTotalStock(shoe.sizes)} uds.`,
      sizesText ? `Talles: ${sizesText}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const canvas = canvasRef.current;
    if (!canvas) return;

    QRCode.toCanvas(canvas, data, { width: 150, margin: 2, color: { dark: '#000000', light: '#ffffff' } })
      .then(() => {
        setFullQr(canvas.toDataURL('image/png'));
      })
      .catch(() => {});
  }, [shoe]);

  return (
    <>
      <canvas ref={canvasRef} className="w-[80px] h-[80px] rounded cursor-pointer hover:ring-2 hover:ring-[#c9a8a8] transition-all duration-150" onClick={() => setShowModal(true)} />
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            {fullQr && <img src={fullQr} alt={`QR ${shoe.name}`} className="w-[250px] h-[250px]" />}
            <p className="text-center text-sm text-[#7a6a6a] mt-3 font-medium">{shoe.name}</p>
            <button onClick={() => setShowModal(false)} className="mt-3 w-full py-2 text-sm text-[#b5a5a5] hover:text-[#7a6a6a] transition-colors duration-150">Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchDescription, setSearchDescription] = useState('');

  const filteredShoes = shoes.filter((s) => {
    const matchName = s.name.toLowerCase().includes(searchName.toLowerCase());
    const matchDesc = s.description.toLowerCase().includes(searchDescription.toLowerCase());
    return matchName && matchDesc;
  });

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

      {shoes.length > 0 && (
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full max-w-xs px-3.5 py-2 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] text-sm placeholder:text-[#d4c5c5] transition-colors duration-150"
          />
          <input
            type="text"
            value={searchDescription}
            onChange={(e) => setSearchDescription(e.target.value)}
            placeholder="Buscar por descripción..."
            className="w-full max-w-xs px-3.5 py-2 border border-[#f0ebe7] rounded-lg focus:ring-2 focus:ring-[#c9a8a8] focus:border-[#c9a8a8] outline-none text-[#3d3d3d] text-sm placeholder:text-[#d4c5c5] transition-colors duration-150"
          />
        </div>
      )}

      {shoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-[#f0ebe7]">
          <p className="text-[#d4c5c5] text-sm font-light">No hay productos. ¡Agregá el primero!</p>
        </div>
      ) : filteredShoes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-[#f0ebe7]">
          <p className="text-[#d4c5c5] text-sm font-light">No se encontraron productos con esos filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#f0ebe7] shadow-sm">
          <table className="w-full bg-white">
            <thead>
              <tr className="border-b border-[#f0ebe7] bg-[#faf7f5]">
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Imagen</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Nombre</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Descripción</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Categoría</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Precio</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Stock</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">QR</th>
                <th className="px-4 py-3.5 text-left text-xs tracking-[0.08em] uppercase font-medium text-[#b5a5a5]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredShoes.map((shoe) => (
                <tr key={shoe.id} className="border-b border-[#f0ebe7] hover:bg-[#faf7f5] transition-colors duration-150">
                  <td className="px-4 py-3">
                    {shoe.image_url ? (
                      <img src={shoe.image_url} alt={shoe.name} className="w-20 h-20 object-cover rounded-lg shadow-md border border-[#f0ebe7]" />
                    ) : (
                      <div className="w-20 h-20 bg-[#f5f0ee] rounded-lg flex items-center justify-center text-[#d4c5c5] text-xs shadow-sm border border-[#f0ebe7]">Sin img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#3d3d3d]">{shoe.name}</td>
                  <td className="px-4 py-3 text-xs text-[#b5a5a5] max-w-[250px] leading-relaxed">{shoe.description || '-'}</td>
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
                    <QRCell shoe={shoe} />
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
