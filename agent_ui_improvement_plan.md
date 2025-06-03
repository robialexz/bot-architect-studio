# Plan for UI Improvements: AI Agent Management

The goal is to enhance the user experience for creating, editing, and managing
AI agents within the 'bot-architect-studio' project, primarily focusing on the
`MyAgents.tsx` page and related workflows.

## 1. Agent Creation Workflow

- **Trigger:**
  - The existing "Add New Agent" button on the `MyAgents.tsx` page (currently
    triggering `FeatureUnderDevelopmentModal`) should open a new dedicated modal
    or navigate to a separate creation page/view. A modal approach might be more
    consistent with the current UI.
- **"Create Agent" Modal/View:**
  - **Fields:**
    - `Agent Name`: Text input (required).
    - `Description`: Textarea for a detailed description (required).
    - `Icon`: A selection mechanism for choosing a Lucide icon (or allow SVG
      upload/selection). This could be a dropdown with icon previews or a
      searchable icon library component.
    - `Category`: Text input or a dropdown with predefined common categories
      (e.g., "Marketing", "Development", "Content", "Data Analysis") and an
      option to add a new category.
    - `Agent Type`: Dropdown to select type (e.g., "Standard", "Premium" - if
      applicable for user-created agents, or perhaps this is set differently).
      This needs clarification based on how "custom" agents fit into the
      existing `type` definition in `MyAgents.tsx` (`standard`, `premium`,
      `custom`).
    - `Initial Status`: Toggle or radio button for "Active" / "Inactive"
      (default to "Active").
    - _(Optional)_ `Tags`: A tag input field allowing users to add relevant
      keywords.
  - **Actions:**
    - "Create Agent" button: Submits the form, creates the agent, and adds it to
      the list on `MyAgents.tsx`.
    - "Cancel" button: Closes the modal/view without creating.
  - **Visuals:** Maintain consistency with the existing `shadcn/ui` components
    and styling.

```mermaid
graph TD
    A[MyAgents.tsx: "Add New Agent" Button] --> B{Open "Create Agent" Modal};
    B --> C[Form: Name, Description, Icon, Category, Type, Status];
    C --> D["Create Agent" Button];
    D --> E[Agent Created & Added to List];
    C --> F["Cancel" Button];
    F --> G[Modal Closed];
```

## 2. Agent Editing Workflow

- **Trigger:**
  - Add an "Edit" icon button (e.g., `Edit3` from Lucide icons) to each agent
    card within the `filteredAgents.map` on the `MyAgents.tsx` page, alongside
    the existing "Remove" and "Activate/Deactivate" buttons.
- **"Edit Agent" Modal/View:**
  - This modal/view should be very similar to the "Create Agent" modal/view.
  - It should be pre-filled with the data of the agent being edited.
  - All fields from the creation process should be editable.
  - **Actions:**
    - "Save Changes" button: Submits the form and updates the agent's details.
    - "Cancel" button: Closes the modal/view without saving changes.

```mermaid
graph TD
    subgraph MyAgents.tsx Page
        H[Agent Card] --> I{Click "Edit" Button};
    end
    I --> J{Open "Edit Agent" Modal (Pre-filled)};
    J --> K[Form: Name, Description, Icon, Category, Type, Status];
    K --> L["Save Changes" Button];
    L --> M[Agent Details Updated];
    K --> N["Cancel" Button];
    N --> O[Modal Closed];
```

## 3. Enhancements to `MyAgents.tsx` Page

- **"Edit" Button:** As described above, add an "Edit" button to each agent
  card.
- **Deletion Confirmation:**
  - When the "Remove" button (`MyAgents.tsx` line 273) is clicked, show a
    confirmation dialog (e.g., `AlertDialog` from `shadcn/ui`) before actually
    deleting the agent.
  - Message: "Are you sure you want to remove [Agent Name]? This action cannot
    be undone."
  - Buttons: "Confirm Remove", "Cancel".
- **(Optional) Enhanced Filtering/Sorting:**
  - **Filter by Category:** Add a dropdown filter for agent categories. This
    would require categories to be stored consistently.
  - **Sort Options:** Add a dropdown to sort agents by: Name (A-Z, Z-A), Date
    Created (Newest, Oldest - requires creation date to be stored), Usage Tokens
    (High-Low, Low-High).
- **Clarity on Agent "Type":**
  - The current `AIAgent` interface in `MyAgents.tsx` (line 47) has
    `type: "standard" | "premium" | "custom"`. The "Add New Agent" flow should
    clarify how a user-created agent is typed. Are they all "custom" by default?
    Can users create "standard" or "premium" types, or are those reserved? This
    impacts the creation form.

## 4. `AIAgentModal.tsx` (Details View)

- **Contextual Usage:** This modal (`AIAgentModal.tsx`) seems primarily used for
  viewing details of agents from a palette/marketplace (as suggested by the
  `AIAgent` interface in `AIAgentCard.tsx` which it uses).
- **No Editing Here (Recommendation):** To avoid confusion, it's recommended
  _not_ to add editing capabilities directly to _this specific_ modal if its
  primary role is informational for agents not yet "in" My Agents. Editing
  should be initiated from the `MyAgents.tsx` page for agents the user
  owns/manages.
- **Customizable "Key Capabilities":** If this modal were to be used for "My
  Agents" as well, the "Key Capabilities" (`AIAgentModal.tsx` line 73) should be
  made more specific to the agent, perhaps by allowing users to define these
  capabilities during agent creation/editing. Currently, they are generic.

## 5. Visual and UX Consistency

- **Styling:** All new UI elements (modals, forms, buttons) should strictly
  adhere to the existing design language established by `shadcn/ui` and the
  project's current aesthetics.
- **Motion:** Continue using `framer-motion` for smooth transitions and
  animations where appropriate (e.g., modal open/close, list updates).
- **Feedback:** Provide clear visual feedback for actions (e.g., toasts for
  successful creation/update/deletion, loading states for buttons during async
  operations). The existing `toast` mechanism (`MyAgents.tsx` line 144) should
  be used.

## Summary of Proposed New/Modified Components:

1.  **`CreateAgentModal.tsx` (New):** Modal for the new agent creation form.
2.  **`EditAgentModal.tsx` (New or part of `CreateAgentModal.tsx`):** Modal for
    editing existing agents. Could potentially be the same component as
    `CreateAgentModal.tsx` but in an "edit" mode.
3.  **Modifications to `MyAgents.tsx`:**
    - Integrate "Edit" button and logic.
    - Add deletion confirmation dialog.
    - (Optional) Add new filter/sort controls.
    - Update "Add New Agent" button to launch `CreateAgentModal.tsx`.
4.  **`ConfirmationDialog.tsx` (New or use `AlertDialog`):** Reusable component
    for confirming actions like deletion.
