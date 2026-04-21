import { Link, useParams } from "react-router-dom";

function PersonProfile({ people }) {
  const { personId } = useParams();
  const person = people.find((member) => member.id === personId);

  if (!person) {
    return (
      <section>
        <h2>Person not found</h2>
        <p>Try another team member from the list.</p>
        <Link to="/">Back to home</Link>
      </section>
    );
  }

  const otherPeople = people.filter((member) => member.id !== personId);

  return (
    <section>
      <h2>{person.name}</h2>
      <p className="person-role">{person.role}</p>
      <p>{person.bio}</p>

      <div className="person-links">
        <h3>Explore the rest of the team</h3>
        <div className="people-grid">
          {otherPeople.map((member) => (
            <Link key={member.id} to={`/people/${member.id}`}>
              <article className="person-card">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PersonProfile;
