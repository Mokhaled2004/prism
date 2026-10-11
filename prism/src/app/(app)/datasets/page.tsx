export default function DatasetsPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-prism-text-strong">
        Datasets
      </h1>
      <p className="text-sm text-prism-muted mt-1 mb-6">
        Define the fields, metrics, and relationships dashboards can use.
      </p>

      <div className="bg-panel border border-dashed border-border rounded-md p-10 text-center">
        <p className="text-sm text-prism-muted">
          No datasets yet.
        </p>
        <button className="mt-3 h-8 px-3 rounded-md bg-accent text-prism-accent-text text-xs font-medium hover:bg-accent-hover">
          Create a dataset
        </button>
      </div>
    </div>
  )
}