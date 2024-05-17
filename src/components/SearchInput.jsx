"use client";

export default function SearchInput({ searchQuery, handleSearchChange }) {
  return (
    <input
      type="text"
      className="border border-indigo-200 px-2 py-1 outline-none focus:border-indigo-800 rounded"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
  );
}
