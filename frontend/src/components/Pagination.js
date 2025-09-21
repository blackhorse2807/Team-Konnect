import React from 'react';

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > pages || p === page) return;
    onPageChange(p);
  };

  const renderPages = () => {
    const items = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > pages) {
      end = pages;
      start = Math.max(1, end - maxButtons + 1);
    }

    if (start > 1) {
      items.push(
        <button key={1} onClick={() => goTo(1)} className={`px-3 py-1.5 rounded-md border ${page === 1 ? 'bg-meesho-pink text-white border-meesho-pink' : 'bg-white text-meesho-darkgray border-gray-200 hover:bg-gray-50'}`}>1</button>
      );
      if (start > 2) items.push(<span key="start-ellipsis" className="px-2 text-gray-400">…</span>);
    }

    for (let p = start; p <= end; p++) {
      items.push(
        <button key={p} onClick={() => goTo(p)} className={`px-3 py-1.5 rounded-md border ${page === p ? 'bg-meesho-pink text-white border-meesho-pink' : 'bg-white text-meesho-darkgray border-gray-200 hover:bg-gray-50'}`}>{p}</button>
      );
    }

    if (end < pages) {
      if (end < pages - 1) items.push(<span key="end-ellipsis" className="px-2 text-gray-400">…</span>);
      items.push(
        <button key={pages} onClick={() => goTo(pages)} className={`px-3 py-1.5 rounded-md border ${page === pages ? 'bg-meesho-pink text-white border-meesho-pink' : 'bg-white text-meesho-darkgray border-gray-200 hover:bg-gray-50'}`}>{pages}</button>
      );
    }

    return items;
  };

  return (
    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="text-sm text-gray-500">Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>{typeof total === 'number' ? <> • <span className="font-medium">{total}</span> results</> : null}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => goTo(page - 1)} disabled={page <= 1} className={`px-3 py-1.5 rounded-md border ${page <= 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-meesho-darkgray border-gray-200 hover:bg-gray-50'}`}>Prev</button>
        {renderPages()}
        <button onClick={() => goTo(page + 1)} disabled={page >= pages} className={`px-3 py-1.5 rounded-md border ${page >= pages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-meesho-darkgray border-gray-200 hover:bg-gray-50'}`}>Next</button>
      </div>
    </div>
  );
};

export default Pagination;

