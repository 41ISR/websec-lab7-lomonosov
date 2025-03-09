import { useEffect, useState } from "react"
import useStore from "../../entities/app/app.store"
import DOMPurify from "dompurify"
const Messages: React.FC = () => {
    const user = useStore((state) => state.user)
    const messages = useStore((state) => state.messages)
    const sendMessage = useStore((state) => state.sendMessage)
    const [content, setContent] = useState("")

    useEffect(() => {
        if (!user) return
    }, [user])

    const handleSend = async () => {
        if (!content.trim()) return
        await sendMessage(content)
        setContent("")
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Chat (XSS vulnerable)</h1>
            <div className="mt-4 border p-2 rounded h-60 overflow-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="p-1 border-b last:border-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content)  }}
                    />
                ))}
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border p-2 rounded flex-grow"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-2 rounded ml-2"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default Messages
