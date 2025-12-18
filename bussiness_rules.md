# Business Rules & Logic

## 1. User Roles & Permissions

The application supports three primary roles: **Owner**, **Admin**, and **Member**.

### **Owner**
*   **Uniqueness**: There is only one Owner per workspace.
*   **Protection**:
    *   The Owner's role cannot be changed via the "Manage Members" dropdown (option is disabled).
    *   The Owner cannot be removed from the workspace. The "Remove Member" (trash can) button is **invisible** for the Owner row to prevent accidental deletion and maintain layout alignment.
*   **Privileges**: Has full access to all features, including member management, invites, and settings.

### **Admin**
*   **Management**: Can manage other members (change roles, remove members), *except* for the Owner.
*   **Privileges**:
    *   Can invite new members.
    *   Can share the space link.
    *   Can access the "Manage Members" modal.

### **Member**
*   **View-Only Access**:
    *   Cannot invite new users. The "Invite" button on the Members card and "Invite New Members" button in the modal are **hidden**.
    *   Cannot share the space. The "Share Space" icon in the header is **hidden**.
    *   Cannot manage other members. The "Manage Members" button is replaced with text **"View Members"**.
    *   Cannot change roles or remove members. In the member list, they see static text for roles instead of dropdowns, and no remove buttons.
    *   The modal title displays **"Members"** instead of "Manage Members".

---

## 2. Member Management Logic

### **Ownership Transfer**
*   **Mechanism**: Ownership can be transferred by selecting the "Owner" role for another member in the dropdown.
*   **Confirmation**: A browser confirmation prompt appears: *"Transfer ownership to [Name]? The current owner will become an Admin."*
*   **Outcome**:
    *   If confirmed, the target member becomes the new **Owner**.
    *   The previous Owner is automatically demoted to **Admin**.

### **Removing Members**
*   **Access**: Only Owners and Admins can remove members.
*   **Protection**: The Owner cannot be removed (button is hidden/invisible).
*   **Confirmation**: A browser confirmation prompt appears: *"Are you sure you want to remove [Name]?"*

### **Filtering**
*   **Role Filter**: Members can be filtered in the modal by their role (Owner, Admin, Member, or All).

---

## 3. Chat System

*   **Channel Independence**: Chat messages are strictly scoped to the **Active Space/Channel**. Changing channels updates the message view to show only the conversation history for that specific space.
*   **Search**: Users can search for channels/spaces by name.

---

## 4. File Management

### **Upload Process**
1.  **Selection**: Users can drag-and-drop files or select them from the system dialog via the "Select From Your Device" button.
2.  **Queue & Progress**:
    *   Selected files enter an `uploadQueue`.
    *   A simulated progress bar fills up for each file.
    *   The "Cancel" button is available throughout the process to abort the upload.
3.  **Confirmation**:
    *   The "Done" button is disabled until **all** files in the queue reach 100% progress.
    *   Clicking "Done" moves the files from the queue to the permanent `files` list.
4.  **File Types**: The system automatically detects basic file types (Image, Video, 3D, Doc) to assign appropriate icons and colors.
