export default function SetupChecklist({ user }) {
  const items = [
    { id: 'connect', label: 'Connect Social Platform', done: false },
    { id: 'firstPost', label: 'Write First Post', done: false },
    { id: 'tour', label: 'Complete Dashboard Tour', done: false },
  ];

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <h2 className="font-semibold mb-2">Setup Checklist</h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center">
            <input type="checkbox" checked={item.done} readOnly className="mr-2" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}