import { forwardRef, useRef, useImperativeHandle } from "react";

const TextSubmitForm = forwardRef(function TextSubmitForm(
    {
        onSubmit,
        placeholder = "Write something...",
        submitOnEnter = true,
        autoFocus = false,
    },
    ref
) {
    const textRef = useRef(null);

    // ✅ expose controlled API to parent
    useImperativeHandle(ref, () => ({
        focus: () => textRef.current?.focus(),
        clear: () => {
            if (textRef.current) textRef.current.value = "";
        },
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = textRef.current?.value?.trim();
        if (!text) return;

        await onSubmit(text);
        textRef.current.value = "";
    };

    return (
        <form onSubmit={handleSubmit}>
      <textarea
          ref={textRef}
          rows={1}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onKeyDown={(e) => {
              if (submitOnEnter && e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
              }
          }}
      />
        </form>
    );
});

export default TextSubmitForm;
