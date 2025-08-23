"use client";

import styled, { createGlobalStyle } from "styled-components";

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

export const GlobalStyle = createGlobalStyle<{ $isDark: boolean }>`
  body {
    background-color: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
    transition: background-color 0.2s ease;
    margin: 0;
    padding: 0;
  }
`;

export const TableWrapper = styled.div<{ $isDark?: boolean }>`
  background: ${(props) =>
    props.$isDark ? "rgba(31, 41, 55, 0.9)" : "rgba(202, 219, 202, 1)"};
  padding: 0.75rem;
  border-radius: 0.75rem;
  max-height: calc(100vh - 160px);
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  box-shadow: 0 8px 30px
    ${(props) =>
      props.$isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(2, 6, 23, 0.08)"};
  border: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(55, 65, 81, 0.4)" : "rgba(2, 6, 23, 0.04)"};
  transform: none;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  table {
    border-collapse: collapse;
    width: 100%;
  }
`;

export const StickyThead = styled.thead<{ $isDark?: boolean }>`
  th {
    position: sticky;
    top: 0;
    z-index: 20;
    background: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")};
    color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
    padding: 0.75rem 1rem;
    border: 1px solid ${(props) => (props.$isDark ? "#4b5563" : "#e5e7eb")};
  }

  th:last-child {
    border-right: none;
  }
`;

export const SortableHeader = styled.th<{ $isDark?: boolean }>`
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;

  &:hover {
    background: ${(props) =>
      props.$isDark ? "#4b5563" : "#e5e7eb"} !important;
  }

  .sort-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .sort-icon {
    font-size: 0.75rem;
    color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
    transition: color 0.15s ease;

    &.active {
      color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
    }
  }
`;

export const TableBody = styled.tbody<{ $isDark?: boolean }>`
  td {
    padding: 0.75rem 1rem;
    color: ${(props) => (props.$isDark ? "#e5e7eb" : "#0f172a")};
    border-right: 1px solid
      ${(props) => (props.$isDark ? "#4b5563" : "#e5e7eb")};
    border-bottom: 1px solid
      ${(props) => (props.$isDark ? "#4b5563" : "#e5e7eb")};
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  td:last-child {
    border-right: none;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

export const ActionButton = styled.button<{ $isDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, transform 80ms ease, box-shadow 120ms ease;
  background-color: ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")};
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#374151")};
  border: 1px solid ${(props) => (props.$isDark ? "#4b5563" : "#d1d5db")};

  &:hover {
    background-color: ${(props) => (props.$isDark ? "#4b5563" : "#e5e7eb")};
  }
`;

export const LoadingContainer = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 0.75rem;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  font-size: 1rem;
  font-style: italic;
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  border-radius: 0.5rem;
  background-color: ${(props) => (props.$isDark ? "#1f2937" : "#fafafa")};
  transition: all 0.2s ease;
`;

export const LoadingSpinner = styled.div<{ $isDark?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  border-top: 3px solid ${(props) => (props.$isDark ? "#10b981" : "#0a7753ff")};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorContainer = styled.div<{ $isDark?: boolean }>`
  text-align: center;
  padding: 4rem;
  color: ${(props) => (props.$isDark ? "#fca5a5" : "#dc2626")};
  font-size: 1rem;
  border: 1px solid ${(props) => (props.$isDark ? "#7f1d1d" : "#fecaca")};
  border-radius: 0.5rem;
  background-color: ${(props) => (props.$isDark ? "#1f1717" : "#fef2f2")};
  transition: all 0.2s ease;
`;

export const NoResultsContainer = styled.div<{ $isDark?: boolean }>`
  text-align: center;
  padding: 4rem;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  font-size: 1.1rem;
  font-style: italic;
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  border-radius: 0.5rem;
  background-color: ${(props) => (props.$isDark ? "#1f2937" : "#f9fafb")};
  transition: all 0.2s ease;

  .emoji {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    display: block;
  }

  .search-icon {
    width: 2rem;
    height: 2rem;
    margin: 0 auto 1rem auto;
    color: ${(props) => (props.$isDark ? "#6b7280" : "#9ca3af")};
    display: block;
  }

  .message {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .suggestion {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

export const ThemeToggleContainer = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
`;

export const ThemeToggleButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border: 2px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  border-radius: 50%;
  background-color: ${(props) => (props.$isDark ? "#1f2937" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: scale(0.95);
  }

  .icon {
    font-size: 1.25rem;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover .icon {
    transform: rotate(20deg);
  }
`;

export const ThemedMain = styled.main<{ $isDark: boolean }>`
  margin: 24px;
  min-height: 100vh;
  background-color: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#0f172a")};
  transition: background-color 0.2s ease, color 0.2s ease;
`;

export const ThemedTitle = styled.h1<{ $isDark: boolean }>`
  font-family: "Mollie Glaston, sans-serif";
  font-size: 1.875rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#111827")};
  transition: color 0.2s ease;

  @media (min-width: 640px) {
    font-size: 2.25rem;
  }
`;

export const ThemedInput = styled.input<{ $isDark: boolean }>`
  width: 100%;
  height: 2.5rem;
  padding: 0 1rem;
  padding-right: 3rem;
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#d1d5db")};
  border-radius: 0.375rem;
  background-color: ${(props) => (props.$isDark ? "#1f2937" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    ring: 2px;
    ring-color: ${(props) => (props.$isDark ? "#6366f1" : "#818cf8")};
    border-color: ${(props) => (props.$isDark ? "#6366f1" : "#818cf8")};
  }

  &::placeholder {
    color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  }
`;
