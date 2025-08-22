"useClient"; 


import styled from "styled-components";
import Link from "next/link"

export const lightTheme = {
  background: "#fff",
  foreground: "#181818",
  border: "#ccc",
  selectMenu: "#fff",
  selectOptionHover: "#f3f4f6",
  selectOptionSelected: "#a855f7",
};

export const darkTheme = {
  background: "#181818",
  foreground: "#fff",
  border: "#444",
  selectMenu: "#181818",
  selectOptionHover: "#333",
  selectOptionSelected: "#a855f7",
};

export const TableWrapper = styled.div`
  background: rgba(202, 219, 202, 1);
  padding: 0.75rem;
  border-radius: 0.75rem;
  max-height: calc(100vh - 160px);
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.08);
  border: 1px solid rgba(2, 6, 23, 0.04);
  transform: none;

  table {
    border-collapse: collapse;
    width: 100%;
  }
`;

export const StickyThead = styled.thead`
  th {
    position: sticky;
    top: 0;
    z-index: 20;
    background: #f3f4f6;
    color: #111827;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
  }

  th:last-child {
    border-right: none;
  }
`;

export const TableBody = styled.tbody`
  td {
    padding: 0.75rem 1rem;
    color: #0f172a;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }
  td:last-child {
    border-right: none;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, transform 80ms ease, box-shadow 120ms ease;
`;