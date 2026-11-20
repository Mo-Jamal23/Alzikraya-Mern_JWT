export default function About() {
  return (
    <div className="about">
      <div className="eyebrow">About Alzikrayat</div>
      <h1 className="about-title">A small archive for meaningful moments.</h1>
      <p className="about-lead">
        Alzikrayat is an individual Advanced Web Technologies project demonstrating how a photo-sharing
        experience can be built with the full MERN stack.
      </p>
      <div className="panel">
        <h2>Architecture</h2>
        <p className="muted">
          The application separates presentation, application, and data concerns. A React frontend with client-side
          routing consumes a RESTful Express API, which validates input with Joi, hashes passwords with bcrypt,
          handles uploads with multer, and enforces ownership checks on the server. Data is stored in MongoDB
          through Mongoose schemas for users, photos, and comments.
        </p>
      </div>
    </div>
  );
}
