import { useNavigate } from "react-router";

import { BaseLayout } from "../components/BaseLayout.tsx";
import { PresetEditor } from "../components/PresetEditor.tsx";
import { useAppPreset } from "../state/context.tsx";

export function EditPage() {
  const [preset, setPreset] = useAppPreset();
  const navigate = useNavigate();

  return (
    <BaseLayout>
      <button
        type="button"
        onClick={() => {
          navigate("/");
        }}
      >
        Back
      </button>
      <div style={{ height: "1rem" }} />
      <PresetEditor preset={preset} onChange={setPreset} />
    </BaseLayout>
  );
}
