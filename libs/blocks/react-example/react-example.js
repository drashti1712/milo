import { html, useState, useEffect, render } from '../../deps/htm-preact.js';
import { loadStyle, getConfig } from '../../utils/utils.js';

// Example React-like component converted to HTM
const TaskList = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return html`
    <div class="task-list-app">
      <div class="task-header">
        <h2>My Tasks</h2>
        <div class="task-input-group">
          <input
            type="text"
            placeholder="Add a new task..."
            value=${newTask}
            onInput=${(e) => setNewTask(e.target.value)}
            onKeyPress=${handleKeyPress}
            class="task-input"
          />
          <button onClick=${addTask} class="add-button">
            Add Task
          </button>
        </div>
      </div>

      <div class="task-filters">
        <button 
          class=${`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick=${() => setFilter('all')}
        >
          All (${tasks.length})
        </button>
        <button 
          class=${`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick=${() => setFilter('active')}
        >
          Active (${tasks.filter(t => !t.completed).length})
        </button>
        <button 
          class=${`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick=${() => setFilter('completed')}
        >
          Completed (${tasks.filter(t => t.completed).length})
        </button>
      </div>

      <div class="task-list">
        ${filteredTasks.length === 0 ? html`
          <div class="empty-state">
            <p>No tasks found. ${filter === 'all' ? 'Add your first task above!' : `No ${filter} tasks.`}</p>
          </div>
        ` : filteredTasks.map(task => html`
          <div key=${task.id} class=${`task-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked=${task.completed}
              onChange=${() => toggleTask(task.id)}
              class="task-checkbox"
            />
            <span class="task-text" onClick=${() => toggleTask(task.id)}>
              ${task.text}
            </span>
            <span class="task-date">
              ${new Date(task.createdAt).toLocaleDateString()}
            </span>
            <button 
              onClick=${() => deleteTask(task.id)}
              class="delete-button"
              title="Delete task"
            >
              ×
            </button>
          </div>
        `)}
      </div>

      <div class="task-summary">
        <p>${tasks.filter(t => !t.completed).length} of ${tasks.length} tasks remaining</p>
      </div>
    </div>
  `;
};

// Data fetching component example
const DataDashboard = ({ apiEndpoint }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call (replace with real API)
    const fetchData = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll simulate data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          users: 1234,
          revenue: '$45,678',
          orders: 89,
          growth: '+12.5%'
        };
        
        setData(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (loading) {
    return html`
      <div class="dashboard-loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    `;
  }

  if (error) {
    return html`
      <div class="dashboard-error">
        <h3>Error Loading Data</h3>
        <p>${error}</p>
        <button onClick=${() => window.location.reload()}>
          Try Again
        </button>
      </div>
    `;
  }

  return html`
    <div class="data-dashboard">
      <h3>Dashboard Overview</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${data.users}</div>
          <div class="metric-label">Total Users</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${data.revenue}</div>
          <div class="metric-label">Revenue</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${data.orders}</div>
          <div class="metric-label">Orders</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${data.growth}</div>
          <div class="metric-label">Growth</div>
        </div>
      </div>
    </div>
  `;
};

// Main React Example Block
const ReactExampleApp = ({ config }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  const initialTasks = [
    { id: 1, text: 'Learn Milo framework', completed: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, text: 'Convert React components to HTM', completed: false, createdAt: new Date().toISOString() },
    { id: 3, text: 'Deploy to production', completed: false, createdAt: new Date().toISOString() }
  ];

  return html`
    <div class="react-example-app">
      <div class="app-header">
        <h1>${config.title || 'React Integration Example'}</h1>
        <p>${config.description || 'This demonstrates React components converted to Milo HTM syntax'}</p>
      </div>

      <div class="app-tabs">
        <button 
          class=${`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick=${() => setActiveTab('tasks')}
        >
          Task Manager
        </button>
        <button 
          class=${`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick=${() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
      </div>

      <div class="app-content">
        ${activeTab === 'tasks' ? html`
          <${TaskList} initialTasks=${initialTasks} />
        ` : html`
          <${DataDashboard} apiEndpoint=${config.apiEndpoint} />
        `}
      </div>
    </div>
  `;
};

// Milo block decorator function
export default function decorate(block) {
  const { miloLibs, codeRoot } = getConfig();
  
  // Load block styles
  loadStyle(`${miloLibs || codeRoot}/blocks/react-example/react-example.css`);
  
  // Parse configuration from the block content
  const rows = Array.from(block.children);
  const config = {};
  
  rows.forEach((row) => {
    const cols = Array.from(row.children);
    if (cols.length >= 2) {
      const key = cols[0].textContent.trim().toLowerCase();
      const value = cols[1].textContent.trim();
      config[key] = value;
    }
  });

  // Clear the block content and render our React-like component
  block.innerHTML = '';
  
  // Create a container for our app
  const container = document.createElement('div');
  container.className = 'react-example-container';
  block.appendChild(container);
  
  // Render the React-like app using Preact
  render(html`<${ReactExampleApp} config=${config} />`, container);
}