import app from "./app";
import { dbConnect } from "./config/db.config";
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

dbConnect();
