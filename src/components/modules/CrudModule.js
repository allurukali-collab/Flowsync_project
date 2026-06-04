import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ModuleLayout from "../common/ModuleLayout";
import {
  EmptyState,
  ModuleLoading,
  RatingStars,
  SearchFilterBar,
  StatCards,
  StatusBadge,
  moduleTheme,
} from "./moduleUi";
import { createItem, deleteItem, listItems, updateItem } from "../../services/moduleApi";
import api from "../../utils/api";

export default function CrudModule({
  title,
  subtitle,
  endpoint,
  columns = [],
  fields = [],
  readOnly = false,
  viewMode = "table",
  emptyTitle,
  emptyMessage,
  searchKeys = [],
  statusKeys = ["status"],
  summaryEndpoint,
  computeStats,
  cardConfig,
  filterFn,
  cardEqualHeight = false,
}) {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listItems(endpoint);
      setRows(Array.isArray(data) ? data : []);
      if (summaryEndpoint) {
        try {
          const sumRes = await api.get(summaryEndpoint);
          const s = sumRes.data;
          setStats([
            { label: "Total Reports", value: s.totalReports, color: "#00bcd4" },
            { label: "Completed Tasks", value: s.completedTasks, color: "#4caf50" },
            { label: "Pending Tasks", value: s.pendingTasks, color: "#ff9800" },
            { label: "Total Hours", value: s.totalHours, color: "#7e57c2" },
          ]);
        } catch {
          setStats([]);
        }
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, summaryEndpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const displayStats = useMemo(() => {
    if (stats.length) return stats;
    if (computeStats) return computeStats(rows);
    return [];
  }, [stats, computeStats, rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (search.trim() && searchKeys.length) {
      const q = search.toLowerCase();
      list = list.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (filterFn) list = filterFn(list, search);
    return list;
  }, [rows, search, searchKeys, filterFn]);

  const openCreate = () => {
    const empty = {};
    fields.forEach((f) => {
      empty[f.key] = f.defaultValue ?? "";
    });
    setForm(empty);
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    const data = {};
    fields.forEach((f) => {
      data[f.key] = row[f.key] ?? "";
    });
    setForm(data);
    setEditing(row);
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      fields.forEach((f) => {
        if (f.type === "number" && payload[f.key] !== "") {
          payload[f.key] = Number(payload[f.key]);
        }
      });
      if (editing?.id) {
        await updateItem(endpoint, editing.id, payload);
      } else {
        await createItem(endpoint, payload);
      }
      setOpen(false);
      load();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await deleteItem(endpoint, id);
      load();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Delete failed");
    }
  };

  const renderCell = (row, col) => {
    const val = row[col.key];
    if (col.render) return col.render(row);
    if (statusKeys.includes(col.key)) return <StatusBadge value={val} />;
    if (col.key === "rating") return <RatingStars rating={val} />;
    return val ?? "—";
  };

  const renderCard = (row) => {
    if (cardConfig?.render) return cardConfig.render(row, { openEdit, handleDelete, readOnly });

    const titleKey = cardConfig?.titleKey || columns[0]?.key;
    const subtitleKey = cardConfig?.subtitleKey;
    const metaKeys = cardConfig?.metaKeys || columns.slice(1, 4).map((c) => c.key);

    return (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        key={row.id}
        sx={{ display: "flex", minWidth: 0 }}
      >
        <Paper
          sx={{
            p: 2.5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            minHeight: cardEqualHeight ? 240 : "auto",
            borderRadius: 2,
            bgcolor: moduleTheme.cardBg,
            border: moduleTheme.cardBorder,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 600,
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {row[titleKey]}
          </Typography>
          {subtitleKey && (
            <Typography
              variant="body2"
              sx={{
                color: "grey.400",
                mb: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row[subtitleKey]}
            </Typography>
          )}
          {metaKeys.map((k) => (
            <Box key={k} sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
              <Typography variant="caption" sx={{ color: "grey.500", textTransform: "capitalize" }}>
                {k.replace(/([A-Z])/g, " $1")}
              </Typography>
              {statusKeys.includes(k) ? (
                <StatusBadge value={row[k]} />
              ) : (
                <Typography variant="body2" sx={{ color: "grey.200" }}>
                  {row[k] ?? "—"}
                </Typography>
              )}
            </Box>
          ))}
          {cardConfig?.showOpen && row.appUrl && (
            <Button
              size="small"
              endIcon={<OpenInNewIcon />}
              href={row.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ mt: 1, color: moduleTheme.accent }}
            >
              Open App
            </Button>
          )}
          {cardConfig?.showMessage && row.message && (
            <Typography variant="body2" sx={{ color: "grey.300", mt: 1, fontStyle: "italic" }}>
              "{row.message}"
            </Typography>
          )}
          {cardConfig?.showRating && <Box sx={{ mt: 1 }}><RatingStars rating={row.rating} /></Box>}
          {cardConfig?.showPriority && row.priority && (
            <Box sx={{ mt: 1 }}><StatusBadge value={row.priority} /></Box>
          )}
          {cardConfig?.showSteps && row.steps?.length > 0 && (
            <Box sx={{ mt: 2, pl: 1, borderLeft: `2px solid ${moduleTheme.accent}` }}>
              {row.steps.map((step, i) => (
                <Typography key={step.id || i} variant="caption" display="block" sx={{ color: "grey.400", mb: 0.5 }}>
                  {step.stepOrder}. {step.stepName} — {step.assignedRole}
                </Typography>
              ))}
            </Box>
          )}
          {!readOnly && (
            <Box sx={{ display: "flex", gap: 0.5, mt: "auto", pt: 2, justifyContent: "flex-end" }}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: moduleTheme.accent }}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: "#ef5350" }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Paper>
      </Grid>
    );
  };

  return (
    <ModuleLayout
      title={title}
      subtitle={subtitle}
      onAdd={readOnly ? undefined : openCreate}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {!loading && displayStats.length > 0 && <StatCards stats={displayStats} />}

      {!loading && searchKeys.length > 0 && (
        <SearchFilterBar value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}...`} />
      )}

      {loading ? (
        <ModuleLoading message={`Loading ${title.toLowerCase()}...`} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={emptyTitle || `No ${title.toLowerCase()} yet`}
          message={emptyMessage || `Get started by adding your first ${title.toLowerCase().replace(/s$/, "")} record.`}
          onAdd={readOnly ? undefined : openCreate}
        />
      ) : viewMode === "cards" ? (
        <Grid container spacing={2} sx={{ width: "100%", margin: 0 }}>
          {filtered.map((row) => renderCard(row))}
        </Grid>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            bgcolor: moduleTheme.cardBg,
            border: moduleTheme.cardBorder,
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: moduleTheme.tableHead }}>
                {columns.map((c) => (
                  <TableCell key={c.key} sx={{ color: "grey.300", fontWeight: 700, py: 1.5 }}>
                    {c.label}
                  </TableCell>
                ))}
                {!readOnly && (
                  <TableCell sx={{ color: "grey.300", fontWeight: 700 }} align="right">
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{
                    "&:hover": { bgcolor: moduleTheme.rowHover },
                    "& td": { borderColor: "rgba(255,255,255,0.06)", color: "grey.100", py: 1.5 },
                  }}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key}>{renderCell(row, c)}</TableCell>
                  ))}
                  {!readOnly && (
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(row)} sx={{ color: moduleTheme.accent }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(row.id)} sx={{ color: "#ef5350" }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "#1e2a45",
            color: "white",
            borderRadius: 3,
            border: moduleTheme.cardBorder,
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            {editing ? "Edit" : "Add New"} {title.replace(/s$/, "")}
          </Typography>
          <Typography variant="body2" sx={{ color: "grey.400", mt: 0.5 }}>
            Fill in the details below. Required fields are marked with *.
          </Typography>
        </DialogTitle>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />
        <DialogContent sx={{ maxHeight: "60vh", overflowY: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {fields.map((f) => (
              <TextField
                key={f.key}
                label={f.required ? `${f.label} *` : f.label}
                type={f.type || "text"}
                multiline={f.multiline}
                rows={f.multiline ? 3 : 1}
                required={f.required}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                fullWidth
                InputLabelProps={{ sx: { color: "grey.400" } }}
                InputProps={{ sx: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                    "&:hover fieldset": { borderColor: moduleTheme.accent },
                  },
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "grey.400" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: moduleTheme.accent, px: 3, "&:hover": { bgcolor: "#00acc1" } }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </ModuleLayout>
  );
}
