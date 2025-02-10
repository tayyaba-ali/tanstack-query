import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "bootstrap/dist/css/bootstrap.min.css"
import { Link, Routes, Route } from 'react-router';
import Products from '../assets/pages/Products';
import Home from '../assets/pages/Home';

function NavbarOur() {
	return (
		<>
			<Navbar expand='lg' className='bg-body-tertiary'>
				<Container>
					<Navbar.Brand>React-Bootstrap</Navbar.Brand>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='ms-auto'>
							<Nav.Link to='/products' as={Link}>
								Products
							</Nav.Link>
							<Nav.Link href='#link'>Link</Nav.Link>
							<NavDropdown title='Dropdown' id='basic-nav-dropdown'>
								<NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/products' element={<Products />} />
			</Routes>
		</>
	);
}

export default NavbarOur;
