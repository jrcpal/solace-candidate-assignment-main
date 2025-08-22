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
  overflow-x: auto;
  overflow-y: auto;
  max-height: calc(100vh - 160px); /* adjust as needed */
  -webkit-overflow-scrolling: touch;
  overflow-x: auto;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.04);
  transform: none;
`;

export const StickyThead = styled.thead`
  th {
    position: sticky;
    top: 0;
    z-index: 20;
    background: #ffffff; /* must be opaque */
    padding: 0.5rem 0.75rem;
    text-align: left;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(4px);
  }
`;