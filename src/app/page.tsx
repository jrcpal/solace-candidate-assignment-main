"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  StickyThead,
  TableWrapper,
  TableBody,
  ActionButton,
  LoadingContainer,
  LoadingSpinner,
  ErrorContainer,
  NoResultsContainer,
  SortableHeader,
  ThemedMain,
  ThemedTitle,
  ThemedInput,
  ResponsiveContainer,
  MobileCard,
  MobileSortControls,
  MobileSortButton,
} from "./styles";
import { useTheme } from "./theme-provider";

type Advocate = {
  id?: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
};

type SortField = keyof Advocate;
type SortDirection = "asc" | "desc";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string>("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isDarkMode } = useTheme();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const fetchAdvocates = async (q: string = "") => {
    // Prevent race conditions - if user types quickly, cancel the previous request to only process the most recent search and avoid stale results
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    // Only show full loading state on initial load, use searching state for subsequent searches
    if (!hasInitiallyLoaded) {
      setLoading(true);
    } else {
      setSearching(true);
    }
    setError("");
    try {
      const url = q
        ? `/api/advocates?q=${encodeURIComponent(q)}`
        : "/api/advocates";

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : [];
      setAdvocates(data);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setAdvocates([]);
      setError("Failed to load advocates");
      console.error("Failed to load advocates:", err);
    } finally {
      setLoading(false);
      setSearching(false);
      if (!hasInitiallyLoaded) {
        setHasInitiallyLoaded(true);
      }
    }
  };

  useEffect(() => {
    fetchAdvocates();
    // Prevent memory leaks and hanging requests when component unmounts
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce to avoid overwhelming the API with requests on every keystroke
    debounceRef.current = setTimeout(() => {
      fetchAdvocates(input);
    }, 300);
  };

  const onReset = () => {
    setSearchTerm("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchAdvocates("");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="sort-icon">↕</span>;
    }
    return (
      <span className={`sort-icon active`}>
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const sortedAdvocates = React.useMemo(() => {
    if (!sortField) return advocates;

    return [...advocates].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle arrays (specialties) - convert to sortable string format
      if (Array.isArray(aVal)) aVal = aVal.join(", ");
      if (Array.isArray(bVal)) bVal = bVal.join(", ");

      // Convert to strings for comparison - ensures consistent sorting across mixed data types
      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [advocates, sortField, sortDirection]);

  return (
    <ThemedMain $isDark={isDarkMode}>
      <ThemedTitle $isDark={isDarkMode}>Solace Advocates</ThemedTitle>

      <div className="mb-6 w-full">
        <div className="flex flex-row items-center">
          <label htmlFor="search"></label>

          <div className="flex-1 flex items-stretch sm:max-w-[45rem]">
            <div className="relative flex-1">
              <ThemedInput
                id="search"
                aria-label="Search Advocates"
                onChange={onChange}
                value={searchTerm}
                placeholder={
                  isMobile
                    ? "Enter search here"
                    : "Enter advocate name, city, specialty, or years of experience here"
                }
                $isDark={isDarkMode}
              />

              {searching && (
                <div
                  style={{
                    position: "absolute",
                    right: searchTerm ? "3rem" : "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                >
                  <LoadingSpinner
                    $isDark={isDarkMode}
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                  />
                </div>
              )}

              {searchTerm ? (
                <ActionButton
                  className="absolute inset-y-0 right-0 px-3 rounded-r-md"
                  onClick={onReset}
                  type="button"
                  aria-label="Reset Search"
                  $isDark={isDarkMode}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    borderRadius: "0 0.375rem 0.375rem 0",
                  }}
                >
                  ✕
                </ActionButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer>
        <TableWrapper $isDark={isDarkMode}>
          {loading ? (
            <LoadingContainer $isDark={isDarkMode}>
              <LoadingSpinner $isDark={isDarkMode} />
              Loading advocates...
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer $isDark={isDarkMode}>{error}</ErrorContainer>
          ) : advocates.length === 0 && hasInitiallyLoaded && searchTerm ? (
            <NoResultsContainer $isDark={isDarkMode}>
              <MagnifyingGlassIcon className="search-icon" />
              <div className="message">No advocates found</div>
              <div className="suggestion">
                Try adjusting your search term "{searchTerm}" or clear the
                search to see all advocates.
              </div>
            </NoResultsContainer>
          ) : advocates.length > 0 ? (
            <>
              {/* Mobile Sort Controls */}
              <MobileSortControls $isDark={isDarkMode}>
                <MobileSortButton
                  $isDark={isDarkMode}
                  $active={sortField === "lastName"}
                  onClick={() => handleSort("lastName")}
                >
                  Name {getSortIcon("lastName")}
                </MobileSortButton>
                <MobileSortButton
                  $isDark={isDarkMode}
                  $active={sortField === "city"}
                  onClick={() => handleSort("city")}
                >
                  City {getSortIcon("city")}
                </MobileSortButton>
                <MobileSortButton
                  $isDark={isDarkMode}
                  $active={sortField === "yearsOfExperience"}
                  onClick={() => handleSort("yearsOfExperience")}
                >
                  Experience {getSortIcon("yearsOfExperience")}
                </MobileSortButton>
                <MobileSortButton
                  $isDark={isDarkMode}
                  $active={sortField === "specialties"}
                  onClick={() => handleSort("specialties")}
                >
                  Specialty {getSortIcon("specialties")}
                </MobileSortButton>
              </MobileSortControls>

              {/* Desktop Table */}
              <table className="desktop-table">
                <StickyThead $isDark={isDarkMode}>
                  <tr>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="sort-content">
                        <span>First Name</span>
                        {getSortIcon("firstName")}
                      </div>
                    </SortableHeader>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("lastName")}
                    >
                      <div className="sort-content">
                        <span>Last Name</span>
                        {getSortIcon("lastName")}
                      </div>
                    </SortableHeader>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("city")}
                    >
                      <div className="sort-content">
                        <span>City</span>
                        {getSortIcon("city")}
                      </div>
                    </SortableHeader>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("degree")}
                    >
                      <div className="sort-content">
                        <span>Degree</span>
                        {getSortIcon("degree")}
                      </div>
                    </SortableHeader>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("specialties")}
                    >
                      <div className="sort-content">
                        <span>Specialties</span>
                        {getSortIcon("specialties")}
                      </div>
                    </SortableHeader>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("yearsOfExperience")}
                    >
                      <div className="sort-content">
                        <span>Years of Experience</span>
                        {getSortIcon("yearsOfExperience")}
                      </div>
                    </SortableHeader>
                    <SortableHeader
                      $isDark={isDarkMode}
                      onClick={() => handleSort("phoneNumber")}
                    >
                      <div className="sort-content">
                        <span>Phone Number</span>
                        {getSortIcon("phoneNumber")}
                      </div>
                    </SortableHeader>
                  </tr>
                </StickyThead>
                <TableBody $isDark={isDarkMode}>
                  {sortedAdvocates.map((advocate, idx) => {
                    const rowKey =
                      advocate.id ??
                      `${advocate.phoneNumber ?? ""}-${
                        advocate.lastName ?? "x"
                      }-${idx}`;
                    return (
                      <tr key={rowKey}>
                        <td>{advocate.firstName}</td>
                        <td>{advocate.lastName}</td>
                        <td>{advocate.city}</td>
                        <td>{advocate.degree}</td>
                        <td>
                          {advocate.specialties.map((s, i) => (
                            <div key={`${rowKey}-spec-${i}`}>{s}</div>
                          ))}
                        </td>
                        <td>{advocate.yearsOfExperience}</td>
                        <td>{advocate.phoneNumber}</td>
                      </tr>
                    );
                  })}
                </TableBody>
              </table>

              {/* Mobile Cards */}
              <div className="mobile-cards">
                {sortedAdvocates.map((advocate, idx) => {
                  const rowKey =
                    advocate.id ??
                    `${advocate.phoneNumber ?? ""}-${
                      advocate.lastName ?? "x"
                    }-${idx}`;
                  return (
                    <MobileCard key={rowKey} $isDark={isDarkMode}>
                      <div className="advocate-name">
                        {advocate.firstName} {advocate.lastName}
                      </div>

                      <div className="advocate-details">
                        <div className="detail-row">
                          <span className="detail-label">City</span>
                          <span className="detail-value">{advocate.city}</span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Degree</span>
                          <span className="detail-value">
                            {advocate.degree}
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Experience</span>
                          <span className="detail-value">
                            {advocate.yearsOfExperience} years
                          </span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Specialties</span>
                          <div className="detail-value">
                            <div className="specialties-list">
                              {advocate.specialties.map((specialty, i) => (
                                <span key={i} className="specialty-tag">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">
                            <a
                              href={`tel:${advocate.phoneNumber}`}
                              className="phone-link"
                            >
                              {advocate.phoneNumber}
                            </a>
                          </span>
                        </div>
                      </div>
                    </MobileCard>
                  );
                })}
              </div>
            </>
          ) : null}
        </TableWrapper>
      </ResponsiveContainer>
    </ThemedMain>
  );
}
