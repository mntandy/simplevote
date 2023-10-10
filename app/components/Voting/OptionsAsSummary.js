import { getClasses, getUserText } from "@/app/lib/styles"

const OptionsAsSummary = ({ organiser, options }) =>
    <div className="main-summary-voting-grid">
        {options.map(e =>
            <div className={getClasses(organiser, "summary-voting-box")} key={e.id}>
                <div style={{ fontWeight: "bold", padding: "5px", gridColumn: "1 / 2" }}>{e.description}</div>
                <div style={{ fontWeight: "bold", gridColumn: "2 / 3", textAlign: "right", whiteSpace: "nowrap", alignSelf: "center" }}>
                    {getUserText(organiser, "total") + " " + e.votes}</div>
            </div>)}
    </div>

export default OptionsAsSummary
