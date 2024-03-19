const Filter = ({ newSearch, onSearchChange }) => (
  <div>
    filter shown with <input value={newSearch} onChange={onSearchChange} />
  </div>
);

export default Filter;
