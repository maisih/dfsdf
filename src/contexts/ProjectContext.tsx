import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  location: string | null;
  progress: number | null;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled" | null;
  budget: number | null;
  spent: number | null;
  start_date: string | null;
  end_date: string | null;
  created_by: string | null;
  description: string | null;
}

interface ProjectContextType {
  selectedProject: Project | null;
  projects: Project[];
  setSelectedProject: (project: Project | null) => void;
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<{ success: boolean; data?: any }>;
  clearProjectData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const clearProjectData = async () => {
    try {
      // Clear project-specific data from tables (except materials and equipment)
      // Tasks
      await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Expenses
      await supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Photos
      await supabase.from('photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Documents
      await supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Signals
      await supabase.from('signals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ Project data cleared, materials and equipment preserved');
    } catch (error) {
      console.error('❌ Error clearing project data:', error);
    }
  };

  const handleProjectSelection = async (project: Project | null) => {
    if (project && project.id !== selectedProject?.id) {
      console.log('🔄 Switching project, clearing compartments except materials and equipment');
      await clearProjectData();
    }
    setSelectedProject(project);
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjects(data || []);
      
      // Auto-select first project if none selected
      if (!selectedProject && data && data.length > 0) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      console.log('🚀 Starting project creation:', project);
      console.log('📍 Selected project before creation:', selectedProject);
      
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Supabase project creation error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('✅ Project created successfully:', data);
      
      // Reload projects to update the list
      await loadProjects();
      
      // Set the newly created project as selected
      if (data) {
        setSelectedProject(data);
        console.log('✅ New project set as selected:', data.name);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('💥 Project creation failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{
      selectedProject,
      projects,
      setSelectedProject: handleProjectSelection,
      loadProjects,
      addProject,
      clearProjectData,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};