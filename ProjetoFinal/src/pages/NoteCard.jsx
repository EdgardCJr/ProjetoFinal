import ReactPlayer from 'react-player';
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { setNewOffset, autoGrow, setZIndex } from "../utils/utils";
import { db } from "../appwrite/databases";
import Spinner from "../icons/Spinner";
import DeleteButton from "../components/DeleteButton";
import { NotesContext } from "../context/NotesContext";


const extractYouTubeLink = (text) => {
    const regex = /(https?:\/\/www\.youtube\.com\/watch\?v=[\w-]+)/g;
    const match = regex.exec(text);
    return match ? match[0] : null;
};

const NoteCard = ({ note }) => {
    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);
    const textAreaRef = useRef(null);

    const { setSelectedNote } = useContext(NotesContext);

    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);

    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const [body, setBody] = useState(note.body || ""); 
    const [youTubeLink, setYouTubeLink] = useState(extractYouTubeLink(note.body || "")); 

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);

    
    const updateYouTubeLink = useCallback((currentBody) => {
        const link = extractYouTubeLink(currentBody);
        setYouTubeLink(link);
    }, []);

    useEffect(() => {
        updateYouTubeLink(body);
    }, [body, updateYouTubeLink]); 

    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            setZIndex(cardRef.current);

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            setSelectedNote(note);
        }
    };

    const mouseMove = (e) => {
        const mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };

        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPosition(newPosition);
    };

    const mouseUp = async () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("position", newPosition);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleKeyUp = () => {
        setSaving(true);

        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }

        keyUpTimer.current = setTimeout(() => {
            const newBody = textAreaRef.current.value; 
            setBody(newBody) 
            saveData("body", newBody);
        }, 2000);
    };

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        const youTubeLink = extractYouTubeLink(pastedText);
        if (youTubeLink) {
            setBody(youTubeLink); 
        } else {
            setBody(pastedText);
        }
    };


    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: colors.colorBody,
                minHeight: youTubeLink ? '500px' : 'auto', 
            }}
        >
            <div
                onMouseDown={mouseDown}
                className="card-header"
                style={{
                    backgroundColor: colors.colorHeader,
                }}
            >
                <DeleteButton noteId={note.$id} />

                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>
                            Saving...
                        </span>
                    </div>
                )}
            </div>
            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                ></textarea>
                {youTubeLink && (
                    <div className="youtube-preview" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <ReactPlayer url={youTubeLink} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
