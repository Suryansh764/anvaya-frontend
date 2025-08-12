# Anvaya CRM Dashboard
A full-stack CRM dashboard designed for sales agents and administrators to organize leads, streamline daily operations, and centralize data management for media, sales, and other lead-driven companies.<br>
Built with a React frontend, Node.js/Express backend, MongoDB database.

## Demo Link 
[Live Demo](https://anvaya-frontend-sand.vercel.app/)

## Quick Start 
```
git clone https://github.com/Suryansh764/anvaya-frontend.git
cd anvaya-frontend
npm install
npm run dev
```

## Technologies
- React JS
- React Router 
- Node JS
- Express JS
- MongoDB

## Demo Video 
Watch a walkthrough (5 minutes) of all major features: <br>
[Loom Video Link](https://www.loom.com/share/b08f9a65abab425888002902a4b8ba23?sid=df737204-24c6-467c-88b0-f0a192dc648a)

## Features 
### Dashboard
- Status-based lead summary cards
- Recent leads section with quick details
- Filter leads by status and other parameters
- “Add Lead” button to quickly create new leads
### Lead Management 
- All leads listed in card format with quick details
- Filters and sorting by status, agent, priority, time to close, etc.
- Clicking a lead card navigates to detailed view
- Lead detail page with:
     - Full lead and assigned agent info
     - Edit & Delete lead options
     - Add comment feature with author selection

### Agent Management
- Agent listing in card view with quick details
- Clicking an agent shows:
    - Full agent profile with edit & delete options
    - All leads assigned to that agent
    - Filtering & sorting for assigned leads
### Reports 
- Dynamic analytics based on lead data
- Clickable status-based lead cards
- Pie chart visualizations for lead scenarios
- Real-time recent activity updates

### Profile
- Static placeholder profile page
- Dynamic data loading & editing
- Quick access to agent’s assigned leads



## API Reference
### GET /api/leads
Fetch all leads, optionally filtered by status (e.g., ?status=Active).
 
Sample Response:
```
{
  "data": {
    "leads": [
      { "_id": "123", "name": "Lead A", "status": "Open", ... }
    ]
  }
}


```
### GET /api/leads/:leadId
Fetch details of a specific lead by ID. <br>
Sample Response:

```

{
  "data": {
    "lead": { "_id": "123", "name": "Lead A", "status": "Open", ... }
  }
}
```

### POST /api/leads 
Create a new lead.
```
{
  "name": "Lead A",
  "status": "Open",
  "salesAgent": "agentId",
  "tags": ["tagId1", "tagId2"]
}
```

### PUT /api/leads/:leadId
Update an existing lead by ID. Automatically updates updatedAt if status changes.


```
{ "status": "Closed" }
```
### DELETE /api/leads/:leadId 
Delete a lead by ID.

### GET /api/leads/status/:status
Fetch all leads with a given status.

### POST /api/leads/:id/comments 
Add a comment to a lead.
```
{
  "text": "Reached out to client, awaiting reply",
  "author": "agentId"
}
```
### GET /api/leads/:id/comments
Fetch all comments for a specific lead, sorted by newest first.

### GET /api/agents
Fetch all sales agents.

### GET /api/agents/:id
Fetch details of a specific agent.

### POST /api/agents 
Create a new sales agent.
```
{
  "name": "Agent X",
  "email": "agent@example.com"
}
```
### PUT /api/agents/:id 
Update details of a sales agent.

### DELETE /api/agents/:id 
Delete a sales agent.

### GET /api/agents/:id/leads
Fetch all leads assigned to a specific agent.

### POST /api/tags 
Create a new tag.
```
{ "name": "High Priority" }
```
### GET /api/tags
Fetch all tags.

### GET /api/reports
Fetch complete CRM analytics:

- Total leads

- Closed leads

- Leads by status

- Leads by priority

- Leads by agent (with closed count)

- Average time to close

- Recent activity (real-time updates)

### GET /api/reports/lead-status
Fetch counts of leads grouped by status.

## Contact 
For bugs or feature requests, please reach out to: kontact2suryanshsks@gmail.com
