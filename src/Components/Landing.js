import Navbar from './Navbar';

const Landing = ({ websiteName, user }) => {
    document.title = 'Home';

    return (
        <>
            <Navbar websiteName={websiteName} user={user} />
            <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                This is a Landing page.
            </div>
        </>
    )
}

export default Landing