/** Plain-text content to HTML. "## " starts a heading, lines starting "- " make a list, blank lines split paragraphs. No raw HTML is ever rendered. */
export default function RichText({ text = '' }) {
  return (
    <div className="space-y-5 leading-relaxed">
      {String(text).split(/\n{2,}/).map((blk, i) => {
        const t = blk.trim();
        if (!t) return null;
        if (t.startsWith('## ')) return <h2 key={i} className="pt-4 text-2xl text-primary">{t.slice(3)}</h2>;
        const lines = t.split('\n');
        if (lines.every((l) => l.startsWith('- '))) return <ul key={i} className="list-disc space-y-1.5 pl-5">{lines.map((l, k) => <li key={k}>{l.slice(2)}</li>)}</ul>;
        return <p key={i} className="whitespace-pre-line">{t}</p>;
      })}
    </div>
  );
}
