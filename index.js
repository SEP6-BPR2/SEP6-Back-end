const server = require("./server")

//Start the server
const app = server.startServer()

const PORT = process.env.PORT || 8888 
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/`)) 