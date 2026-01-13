import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Button,
  Table,
  Form,
  InputGroup,
  Card
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

interface Retailer {
  id: number;
  distributor_name: string;
  location: string;
  salesman_name: string;
  shop_name: string;
  shop_address: string;
  contact_person: string;
  contact_mobile: string;
  shop_age: number;
  shop_photo: string;
  google_map_link: string;
  created_at: string;
}

type SortField = keyof Retailer;
type SortDirection = "asc" | "desc";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // 🔥 Fetch live MySQL data
  useEffect(() => {
    fetch("http://localhost:5000/api/retailers")
      .then(res => res.json())
      .then(data => {
        setRetailers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 🔍 Search across all DB columns
  const filteredData = useMemo(() => {
    return retailers.filter(r =>
      Object.values(r).some(val =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [retailers, searchTerm]);

  // 🔃 Sort any column
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  return (
    <div className="dashboard-page">
      <Navbar bg="primary" variant="dark" className="mb-4">
        <Container fluid>
          <Navbar.Brand>Retailer Management</Navbar.Brand>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </Navbar>

      <Container fluid>
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <h5>Retailers Database</h5>
            <InputGroup style={{ width: 300 }}>
              <Form.Control
                placeholder="Search any field..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Header>

          <Card.Body className="p-0">
            <Table responsive bordered hover size="sm">
              <thead className="table-light">
                <tr>
                  {retailers[0] &&
                    Object.keys(retailers[0]).map(col => (
                      <th
                        key={col}
                        style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                        onClick={() => handleSort(col as SortField)}
                      >
                        {col.replaceAll("_", " ").toUpperCase()}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center p-4">
                      No data found
                    </td>
                  </tr>
                ) : (
                  sortedData.map(r => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.distributor_name}</td>
                      <td>{r.location}</td>
                      <td>{r.salesman_name}</td>
                      <td>{r.shop_name}</td>
                      <td>{r.shop_address}</td>
                      <td>{r.contact_person}</td>
                      <td>{r.contact_mobile}</td>
                      <td>{r.shop_age}</td>

                      {/* 🖼️ Shop Photo */}
                      <td>
                        {r.shop_photo && (
                          <img
                            src={`http://localhost:5000/uploads/${r.shop_photo}`}
                            width="60"
                            height="60"
                            style={{ objectFit: "cover", borderRadius: 4 }}
                          />
                        )}
                      </td>

                      {/* 📍 Google Map (auto fix https) */}
                      <td>
                        {r.google_map_link && (
                          <a
                            href={
                              r.google_map_link.startsWith("http")
                                ? r.google_map_link
                                : "https://" + r.google_map_link
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Map
                          </a>
                        )}
                      </td>

                      <td>
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Dashboard;
