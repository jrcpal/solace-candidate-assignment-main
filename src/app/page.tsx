"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { StickyThead, TableWrapper } from "./styles";

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
        value.toLowerCase().includes(inputLC)
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
      <h1>Solace Advocates</h1>

      <div>
        <div>
          <label htmlFor="search">
            Search advocates: <span id="search-term">{searchTerm}</span>{" "}
          </label>
          <p></p>
          <input
            id="search"
            aria-label="Search Advocates"
            style={{ border: "1px solid black" }}
            onChange={onChange}
            value={searchTerm}
            placeholder="Enter name, city, specialty, or years of experience here"
          />
          <button onClick={onClick}>Reset Search</button>
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
