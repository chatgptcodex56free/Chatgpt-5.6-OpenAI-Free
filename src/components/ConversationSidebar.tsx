import React, { useState } from 'react';
import type { Conversation, ConversationFolder } from '../types';
import { formatDate } from '../utils/helpers';
import { VARIANT_COLORS } from '../config/constants';

interface ConversationSidebarProps {
  conversations: Conversation[];
  folders: ConversationFolder[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onExportMd: (id: string) => void;
  onExportTxt: (id: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  folders,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onExportMd,
  onExportTxt,
}) => {
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by date
  const groups: Record<string, Conversation[]> = {};
  for (const c of [...filtered].sort((a, b) => b.updatedAt - a.updatedAt)) {
    const key = formatDate(c.updatedAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  }

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="conv-sidebar" onClick={closeContextMenu}>
      <div className="conv-sidebar__header">
        <button className="conv-sidebar__new-btn" onClick={onNew}>
          + New Chat
        </button>
      </div>

      <div className="conv-sidebar__search-wrapper">
        <input
          className="conv-sidebar__search"
          type="text"
          placeholder="Search conversations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search conversations"
        />
      </div>

      <div className="conv-sidebar__list">
        {Object.entries(groups).map(([date, convos]) => (
          <div key={date} className="conv-sidebar__group">
            <div className="conv-sidebar__group-label">{date}</div>
            {convos.map((c) => (
              <div
                key={c.id}
                className={`conv-sidebar__item ${c.id === activeId ? 'conv-sidebar__item--active' : ''}`}
                onClick={() => onSelect(c.id)}
                onContextMenu={(e) => handleContextMenu(e, c.id)}
              >
                <span
                  className="conv-sidebar__item-dot"
                  style={{ background: VARIANT_COLORS[c.variant] }}
                />
                <span className="conv-sidebar__item-title">{c.title}</span>
              </div>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="conv-sidebar__empty">No conversations yet.</p>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="conv-sidebar__ctx-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => { onExportMd(contextMenu.id); closeContextMenu(); }}>Export .md</button>
          <button onClick={() => { onExportTxt(contextMenu.id); closeContextMenu(); }}>Export .txt</button>
          <button
            className="conv-sidebar__ctx-delete"
            onClick={() => { onDelete(contextMenu.id); closeContextMenu(); }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ConversationSidebar;
