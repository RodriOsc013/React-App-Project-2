import { Link } from "react-router-dom";

function Home({ people }) {
  return (
    <section>
      <h2>Meet the team</h2>
      <p>Select a person to view their profile.</p>

      <div className="people-grid">
        {people.map((person) => (
          <Link key={person.id} to={`/people/${person.id}`}>
            <article className="person-card">
              <h3>{person.name}</h3>
              <p>{person.role}</p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Home;
