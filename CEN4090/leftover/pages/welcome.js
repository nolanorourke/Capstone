export async function getServerSideProps(context) {
    const { query } = context;
    const { username } = query;

    const response = await fetch(`http://localhost:5000/${username}`, {
        credentials: 'include',
        headers: {
            Cookie: context.req.headers.cookie || "", // Forward the cookies from the incoming request to Flask
        },
    });

    if (!response.ok) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const user = await response.json();
    return { props: { user } };
}

export default function Welcome({ user }) {
    return (
        <div className="welcome-page">
            <h1>Welcome, {user.firstName} {user.lastName}!</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}