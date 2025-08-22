"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { StickyThead, TableWrapper, ActionButton } from "./styles";

type Advocate = {
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

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">
        Solace Advocates
      </h1>

      <div className="mb-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <label htmlFor="search" className="self-end">
            Search advocates:
          </label>

          <div className="flex-1 relative">
            <input
              id="search"
              aria-label="Search Advocates"
              style={{ border: "1px solid black" }}
              onChange={onChange}
              value={searchTerm}
              placeholder="Enter name, city, specialty, or years of experience here"
              className="w-full sm:w-96 md:w-[40rem] px-4 py-1 pr-28 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 text-left"
            />
            <ActionButton
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-white bg-green-700 hover:bg-[#228B22] z-10"
              onClick={onClick}
              type="button"
              aria-label="Search"
            >
              Search
            </ActionButton>
          </div>

          <div className="flex-none">
            <ActionButton
              className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md"
              onClick={onClick}
              type="button"
              aria-label="Reset Search"
            >
              Reset
            </ActionButton>
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
          <tbody>
            {filteredAdvocates.map((advocate, idx) => {
              const rowKey =
                advocate.phoneNumber ?? `${advocate.lastName ?? "x"}-${idx}`;
              return (
                <tr key={rowKey}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s) => (
                      <div key={`${rowKey}-specialties`}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrapper>
    </main>
  );
}
