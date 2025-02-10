const CLASSES = {
  container: 'overflow-x-auto flex-1',
  table: 'min-w-full border-collapse',
  header: {
    row: 'bg-gray-200',
    cell: 'px-6 py-3 border-b text-left',
  },
  body: {
    row: 'border-b hover:bg-gray-50',
    cell: 'px-6 py-4 border-b',
  },
};

interface Column {
  name: string;
  header: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column[];
  rowKey: keyof T;
}

type TableData = Record<string, string | number | boolean>;

export function Table<T extends TableData>({ data, columns, rowKey }: TableProps<T>) {
  return (
    <div className={CLASSES.container}>
      <table className={CLASSES.table}>
        <thead>
          <tr className={CLASSES.header.row}>
            {columns.map((column) => (
              <th key={column.name} className={CLASSES.header.cell}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={String(row[rowKey])} className={CLASSES.body.row}>
              {columns.map((column) => (
                <td key={column.name} className={CLASSES.body.cell}>
                  {String(row[column.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
