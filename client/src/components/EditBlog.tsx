import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Bold,
    Italic,
    Underline,
    Link,
    List,
    ImageUpload,
    MediaEmbed,
    Paragraph
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

interface EditorProps {
    props: {
        initialData?: string;
        onChange?: (event: any, editor: any) => void;
    };
}

export default function Editor({ props }: EditorProps) {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const editorWordCountRef = useRef<HTMLDivElement>(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'insertImage',
                        'mediaEmbed'
                    ], 
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Essentials,
                    Bold,
                    Italic,
                    Underline,
                    Link,
                    List,
                    ImageUpload,
                    MediaEmbed,
                    Paragraph
                ],
                placeholder: 'Type your content here!', 
                initialData: typeof props?.initialData === 'string' ? props.initialData : '',
                licenseKey: LICENSE_KEY
            }
        };
    }, [isLayoutReady]);

    return (
        <div className="main-container">
            <div
                className="editor-container editor-container_classic-editor editor-container_include-block-toolbar editor-container_include-word-count"
                ref={editorContainerRef}
            >
                <div className="editor-container__editor">
                    <div ref={editorRef}>
                        {editorConfig && (
                            <CKEditor
                                onChange={props.onChange}
                                onReady={editor => {
                                    const wordCount = editor.plugins.get('WordCount');
                                    editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
                                }}
                                onAfterDestroy={() => {
                                    Array.from(editorWordCountRef.current.children).forEach(child => child.remove());
                                }}
                                editor={ClassicEditor}
                                config={editorConfig}
                            />
                        )}
                    </div>
                </div>
                <div className="editor_container__word-count" ref={editorWordCountRef}></div>
            </div>
        </div>
    );
}