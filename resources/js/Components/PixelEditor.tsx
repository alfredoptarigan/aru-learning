import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/Components/ui/button";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PixelEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const MenuButton = ({
    isActive,
    onClick,
    children,
    title,
}: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            "p-1.5 border-2 border-black dark:border-white transition-all font-vt323 flex items-center justify-center",
            isActive
                ? "bg-black dark:bg-white text-white dark:text-black shadow-none translate-x-[1px] translate-y-[1px]"
                : "bg-white dark:bg-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
        )}
    >
        {children}
    </button>
);

export default function PixelEditor({
    value,
    onChange,
    className,
    placeholder = "Write something epic...",
}: PixelEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
                emptyEditorClass:
                    "is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none",
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[200px] p-4 font-vt323 text-lg max-w-none text-black dark:text-gray-100",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div
            className={cn(
                "border-2 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col",
                className,
            )}
        >
            {/* Toolbar */}
            <div className="border-b-2 border-black dark:border-white p-2 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-900">
                <MenuButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Code"
                >
                    <Code className="w-4 h-4" />
                </MenuButton>

                <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                <MenuButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive("orderedList")}
                    title="Ordered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
