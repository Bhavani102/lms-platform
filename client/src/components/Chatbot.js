import React, { useState, useEffect } from "react";
import { pipeline } from "@xenova/transformers";
import stringSimilarity from "string-similarity";
import ReactMarkdown from "react-markdown";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [qaData, setQaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [chatSessions, setChatSessions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Load dataset
    fetch("/os.txt")
      .then((response) => response.text())
      .then((data) => {
        const parsedData = JSON.parse(data);
        setQaData(parsedData);
      })
      .catch((error) => console.error("Error loading dataset:", error));

    // Load the LLM model in the browser
    pipeline("text2text-generation", "Xenova/flan-t5-small", { quantized: true })
      .then((generator) => {
        setModel(generator);
      })
      .catch((error) => console.error("Model loading error:", error));

    // Load past chat sessions from localStorage
    const savedChats = JSON.parse(localStorage.getItem("chatSessions")) || {};
    setChatSessions(savedChats);
  }, []);

  const saveChatSession = (history) => {
    const dateKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const updatedSessions = { ...chatSessions, [dateKey]: history };
    setChatSessions(updatedSessions);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
  };

  const formatAnswer = (answer) => {
    if (!answer) return "";

    return answer
      .replace(/```c([\s\S]*?)```/g, "```\n$1\n```")  // Format C code blocks
      .replace(/\n/g, "\n\n")  // Add extra new lines for better readability
      .replace(/###/g, "##")   // Larger headings
      .replace(/\*\*(.*?)\*\*/g, "**$1**");  // Bold text
  };

  const searchAnswer = async (userQuestion) => {
    if (!userQuestion.trim()) return;

    setLoading(true);

    // Simulate a 1-2 second delay
    setTimeout(async () => {
      const userQuestionLower = userQuestion.toLowerCase();
      const questionsArray = qaData.map((item) => item.qText.toLowerCase());

      if (typeof userQuestionLower !== "string" || !Array.isArray(questionsArray)) {
        console.error("Invalid arguments for string-similarity.");
        setLoading(false);
        return;
      }

      const result = stringSimilarity.findBestMatch(userQuestionLower, questionsArray);
      const bestMatchIndex = result.bestMatchIndex;
      const bestMatch = result.bestMatch;
      const threshold = 0.4;

      let foundAnswer = null;

      // Check if a matching answer exists in os.txt
      if (bestMatch.rating >= threshold) {
        foundAnswer = qaData[bestMatchIndex].answers.join("\n\n");
      } else if (model) {
        // Use LLM for general knowledge answers
        const llmResponse = await model(userQuestion, { max_length: 200 });
        foundAnswer = llmResponse[0]?.generated_text || "I don't know the answer.";
      }

      const formattedAnswer = formatAnswer(foundAnswer);

      const updatedHistory = [...chatHistory, { question: userQuestion, answer: formattedAnswer }];
      setChatHistory(updatedHistory);
      saveChatSession(updatedHistory);
      setQuestion("");
      setLoading(false);
    }, Math.random() * 1000 + 1000);  // 1-2 second delay
  };

  const loadChatSession = (date) => {
    setSelectedDate(date);
    setChatHistory(chatSessions[date] || []);
  };

  return (
    <Container maxWidth="md" style={{ display: "flex", marginTop: "20px" }}>
      <Drawer variant="permanent" anchor="left">
        <List style={{ width: "250px", padding: "10px" }}>
          <Typography variant="h6">Past Chats</Typography>
          {Object.keys(chatSessions).map((date) => (
            <ListItem button key={date} onClick={() => loadChatSession(date)}>
              <ListItemText primary={date} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Card variant="outlined" style={{ flex: 1, marginLeft: "260px" }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            AI Chatbot
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            {selectedDate ? `Chat from ${selectedDate}` : "Today's chat"}
          </Typography>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              marginBottom: "10px",
            }}
          >
            {chatHistory.length === 0 && <Typography>No messages yet.</Typography>}
            {chatHistory.map((chat, index) => (
              <div key={index} style={{ marginBottom: "10px", textAlign: chat.question ? "right" : "left" }}>
                <Typography variant="body1" style={{ fontWeight: "bold", color: chat.question ? "#1976d2" : "#000" }}>
                  {chat.question ? "You: " + chat.question : "Bot:"}
                </Typography>
                <div
                  style={{
                    backgroundColor: chat.question ? "#d1e7ff" : "#e3f2fd",
                    padding: "10px",
                    borderRadius: "5px",
                    display: "inline-block",
                    maxWidth: "80%",
                  }}
                >
                  <ReactMarkdown>{chat.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <TextField
            fullWidth
            variant="outlined"
            label="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => searchAnswer(question)}
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={24} style={{ marginRight: "10px" }} />
                <Typography>Loading...</Typography>
              </div>
            ) : (
              "Ask"
            )}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Chatbot;
