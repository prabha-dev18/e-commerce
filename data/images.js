// All site images live here. To use your own, paste any image link (Google/Cloudinary/Unsplash/your server) as the value.
const u = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  serum: u('photo-1620916566398-39f1143ab7be'),
  jar: u('photo-1608248543803-ba4f8c70ae0b'),
  lipstick: u('photo-1586495777744-4413f21062fa'),
  sunscreen: u('photo-1556228720-195a672e8a03'),
  dropper: u('photo-1571781926291-c477ebfd024b'),
  hairOil: u('photo-1598440947619-2c35fc9aa908'),
  perfume: u('photo-1541643600914-78b084683601'),
  eyes: u('photo-1512496015851-a90fb38ba796'),
  bodyButter: u('photo-1556228578-8c89e6adf883'),
  cleanser: u('photo-1556228453-efd6c1ff04f6'),
  makeup: u('photo-1596462502278-27bfdc403348'),
  brushes: u('photo-1522335789203-aabd1fc54bc9'),
  retinol: u('photo-1617897903246-719242758050'),
  hair: u('photo-1527799820374-dcf8d9d4a388'),
  spa: u('photo-1507652313519-d4e9174996dd'),
  men: u('photo-1503951914875-452162b0f3f1'),
};
