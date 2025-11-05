'use client'

import {Nav} from "react-bootstrap";



export default function Sidebar() {

    return (
        <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
             activeKey="/home"
             // onSelect={selectedKey => alert(`selected ${selectedKey}`)}
             >
            <Nav.Item>
                <Nav.Link href="/">Etusivu</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/saa">Sääennuste</Nav.Link>
            </Nav.Item>
        </Nav>
    );

}
