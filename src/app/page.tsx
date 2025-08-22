"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { StickyThead, TableWrapper, TableBody, ActionButton } from "./styles";

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

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/advocates");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        setAdvocates(data);
        setFilteredAdvocates(data);
      } catch (err) {
        console.error("Failed to load advocates:", err);
        setAdvocates([]);
        setFilteredAdvocates([]);
      }
    })();
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchTerm(input);

    console.log("filtering advocates...");
    const inputLC = input.toLowerCase();

    const fieldValues = (advocate: Advocate) => {
      return [
        advocate.firstName ?? "",
        advocate.lastName ?? "",
        advocate.city ?? "",
        advocate.degree ?? "",
        Array.isArray(advocate.specialties)
          ? advocate.specialties.join(" ")
          : String(advocate.specialties ?? ""),
        String(advocate.yearsOfExperience ?? ""),
        advocate.phoneNumber ?? "",
      ];
    };

    const filteredAdvocates = advocates.filter((advocate) =>
      fieldValues(advocate).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(inputLC)
      )
    );

    setFilteredAdvocates(filteredAdvocates);
  };

  const onReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
        Solace Advocates
      </h1>

      <div className="mb-6 w-full">
        <div className="flex flex-row items-center">
          <label htmlFor="search"></label>

          <div className="flex-1 flex items-stretch sm:max-w-[45rem]">
            <div className="relative flex-1">
              <input
                id="search"
                aria-label="Search Advocates"
                onChange={onChange}
                value={searchTerm}
                placeholder="Enter advocate name, city, specialty, or years of experience here"
                className="w-full h-10 px-4 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />

              {searchTerm ? (
                <ActionButton
                  className="absolute inset-y-0 right-0 px-3 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-r-md"
                  onClick={onReset}
                  type="button"
                  aria-label="Reset Search"
                >
                  ✕
                </ActionButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <TableWrapper>
        <table>
          <StickyThead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
          </StickyThead>
          <TableBody>
            {filteredAdvocates.map((advocate, idx) => {
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
      </TableWrapper>
    </main>
  );
}
