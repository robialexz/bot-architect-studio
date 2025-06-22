#!/usr/bin/env python3
"""
Test script to create and execute 3 test workflows
Tests the complete workflow functionality end-to-end
"""

import requests
import json
import time
from typing import Dict, Any

class WorkflowTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api/v1"
        self.token = None
        
    def register_test_user(self) -> bool:
        """Register a test user for workflow testing"""
        try:
            user_data = {
                "email": "test@flowsyai.com",
                "password": "testpassword123",
                "full_name": "Test User"
            }
            
            response = requests.post(f"{self.api_url}/auth/register", json=user_data)
            if response.status_code in [200, 201]:
                print("✅ Test user registered successfully")
                return True
            elif response.status_code == 400 and "already registered" in response.text:
                print("✅ Test user already exists")
                return True
            else:
                print(f"❌ User registration failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ User registration error: {e}")
            return False
    
    def login_test_user(self) -> bool:
        """Login test user and get JWT token"""
        try:
            login_data = {
                "username": "test@flowsyai.com",  # FastAPI OAuth2 uses 'username' field
                "password": "testpassword123"
            }
            
            response = requests.post(
                f"{self.api_url}/auth/login", 
                data=login_data,  # OAuth2 expects form data
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                print("✅ User logged in successfully")
                return True
            else:
                print(f"❌ Login failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False
    
    def get_headers(self) -> Dict[str, str]:
        """Get headers with authentication token"""
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers
    
    def create_workflow(self, workflow_data: Dict[str, Any]) -> str:
        """Create a workflow and return its ID"""
        try:
            response = requests.post(
                f"{self.api_url}/workflows/",
                json=workflow_data,
                headers=self.get_headers()
            )
            
            if response.status_code in [200, 201]:
                data = response.json()
                workflow_id = data.get("id")
                print(f"✅ Workflow '{workflow_data['name']}' created with ID: {workflow_id}")
                return workflow_id
            else:
                print(f"❌ Workflow creation failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Workflow creation error: {e}")
            return None
    
    def execute_workflow(self, workflow_id: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a workflow with input data"""
        try:
            execution_data = {
                "input_data": input_data,
                "async": False  # Synchronous execution for testing
            }
            
            response = requests.post(
                f"{self.api_url}/workflows/{workflow_id}/execute",
                json=execution_data,
                headers=self.get_headers()
            )
            
            if response.status_code in [200, 201]:
                data = response.json()
                print(f"✅ Workflow executed successfully")
                return data
            else:
                print(f"❌ Workflow execution failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Workflow execution error: {e}")
            return None
    
    def test_workflow_1_text_processing(self):
        """Test Workflow 1: Text processing - Input text → AI summarization → Output"""
        print("\n🧪 Testing Workflow 1: Text Processing")
        
        workflow_data = {
            "name": "Text Summarization Workflow",
            "description": "Summarize input text using AI",
            "workflow_data": {
                "nodes": [
                    {
                        "id": "input_1",
                        "type": "input",
                        "data": {
                            "label": "Text Input",
                            "input_type": "text",
                            "required": True
                        },
                        "position": {"x": 100, "y": 100}
                    },
                    {
                        "id": "ai_1",
                        "type": "ai_model",
                        "data": {
                            "label": "AI Summarizer",
                            "model": "gpt-3.5-turbo",
                            "prompt": "Summarize the following text in 2-3 sentences: {input_1}",
                            "max_tokens": 150
                        },
                        "position": {"x": 300, "y": 100}
                    },
                    {
                        "id": "output_1",
                        "type": "output",
                        "data": {
                            "label": "Summary Output",
                            "output_type": "text"
                        },
                        "position": {"x": 500, "y": 100}
                    }
                ],
                "connections": [
                    {"source": "input_1", "target": "ai_1", "sourceHandle": "output", "targetHandle": "input"},
                    {"source": "ai_1", "target": "output_1", "sourceHandle": "output", "targetHandle": "input"}
                ]
            },
            "category": "text_processing",
            "tags": ["ai", "summarization", "nlp"]
        }
        
        # Create workflow
        workflow_id = self.create_workflow(workflow_data)
        if not workflow_id:
            return False
        
        # Execute workflow
        input_data = {
            "input_1": """
            Artificial Intelligence (AI) is a rapidly evolving field that encompasses machine learning, 
            natural language processing, computer vision, and robotics. AI systems are being deployed 
            across various industries including healthcare, finance, transportation, and entertainment. 
            The technology has the potential to revolutionize how we work, communicate, and solve complex 
            problems. However, it also raises important questions about ethics, privacy, job displacement, 
            and the need for responsible development and deployment of AI systems.
            """
        }
        
        result = self.execute_workflow(workflow_id, input_data)
        if result:
            print(f"📄 Summary Result: {result.get('output_data', {}).get('output_1', 'No output')}")
            return True
        
        return False
    
    def test_workflow_2_content_generation(self):
        """Test Workflow 2: Content generation - Topic input → AI content creation → Format output"""
        print("\n🧪 Testing Workflow 2: Content Generation")
        
        workflow_data = {
            "name": "Blog Post Generator",
            "description": "Generate blog post content from topic",
            "workflow_data": {
                "nodes": [
                    {
                        "id": "input_1",
                        "type": "input",
                        "data": {
                            "label": "Topic Input",
                            "input_type": "text",
                            "required": True
                        },
                        "position": {"x": 100, "y": 100}
                    },
                    {
                        "id": "ai_1",
                        "type": "ai_model",
                        "data": {
                            "label": "Content Generator",
                            "model": "gpt-3.5-turbo",
                            "prompt": "Write a comprehensive blog post about: {input_1}. Include an introduction, main points, and conclusion.",
                            "max_tokens": 500
                        },
                        "position": {"x": 300, "y": 100}
                    },
                    {
                        "id": "formatter_1",
                        "type": "text_formatter",
                        "data": {
                            "label": "Markdown Formatter",
                            "format": "markdown",
                            "add_metadata": True
                        },
                        "position": {"x": 500, "y": 100}
                    },
                    {
                        "id": "output_1",
                        "type": "output",
                        "data": {
                            "label": "Formatted Content",
                            "output_type": "text"
                        },
                        "position": {"x": 700, "y": 100}
                    }
                ],
                "connections": [
                    {"source": "input_1", "target": "ai_1"},
                    {"source": "ai_1", "target": "formatter_1"},
                    {"source": "formatter_1", "target": "output_1"}
                ]
            },
            "category": "content_generation",
            "tags": ["ai", "content", "blog", "writing"]
        }
        
        # Create workflow
        workflow_id = self.create_workflow(workflow_data)
        if not workflow_id:
            return False
        
        # Execute workflow
        input_data = {
            "input_1": "The Future of Renewable Energy"
        }
        
        result = self.execute_workflow(workflow_id, input_data)
        if result:
            print(f"📝 Generated Content: {result.get('output_data', {}).get('output_1', 'No output')[:200]}...")
            return True
        
        return False
    
    def test_workflow_3_data_analysis(self):
        """Test Workflow 3: Data analysis - Upload file → AI analysis → Generate report"""
        print("\n🧪 Testing Workflow 3: Data Analysis")
        
        workflow_data = {
            "name": "Data Analysis Workflow",
            "description": "Analyze uploaded data and generate insights",
            "workflow_data": {
                "nodes": [
                    {
                        "id": "file_input_1",
                        "type": "file_input",
                        "data": {
                            "label": "Data File Upload",
                            "accepted_types": ["csv", "json", "xlsx"],
                            "required": True
                        },
                        "position": {"x": 100, "y": 100}
                    },
                    {
                        "id": "processor_1",
                        "type": "data_processor",
                        "data": {
                            "label": "Data Processor",
                            "operation": "analyze_structure"
                        },
                        "position": {"x": 300, "y": 100}
                    },
                    {
                        "id": "ai_1",
                        "type": "ai_model",
                        "data": {
                            "label": "Data Analyzer",
                            "model": "gpt-3.5-turbo",
                            "prompt": "Analyze this data structure and provide insights: {processor_1}",
                            "max_tokens": 300
                        },
                        "position": {"x": 500, "y": 100}
                    },
                    {
                        "id": "report_1",
                        "type": "report_generator",
                        "data": {
                            "label": "Report Generator",
                            "format": "html",
                            "include_charts": True
                        },
                        "position": {"x": 700, "y": 100}
                    },
                    {
                        "id": "output_1",
                        "type": "output",
                        "data": {
                            "label": "Analysis Report",
                            "output_type": "file"
                        },
                        "position": {"x": 900, "y": 100}
                    }
                ],
                "connections": [
                    {"source": "file_input_1", "target": "processor_1"},
                    {"source": "processor_1", "target": "ai_1"},
                    {"source": "ai_1", "target": "report_1"},
                    {"source": "report_1", "target": "output_1"}
                ]
            },
            "category": "data_analysis",
            "tags": ["ai", "data", "analysis", "reporting"]
        }
        
        # Create workflow
        workflow_id = self.create_workflow(workflow_data)
        if not workflow_id:
            return False
        
        # Execute workflow with sample data
        input_data = {
            "file_input_1": {
                "filename": "sample_data.csv",
                "content": "name,age,city\nJohn,25,New York\nJane,30,Los Angeles\nBob,35,Chicago",
                "type": "csv"
            }
        }
        
        result = self.execute_workflow(workflow_id, input_data)
        if result:
            print(f"📊 Analysis Report: {result.get('output_data', {}).get('output_1', 'No output')}")
            return True
        
        return False
    
    def run_all_tests(self):
        """Run all workflow tests"""
        print("🚀 Starting FlowsyAI Workflow Testing...")
        
        # Setup
        if not self.register_test_user():
            return False
        
        if not self.login_test_user():
            return False
        
        # Test workflows
        results = []
        results.append(self.test_workflow_1_text_processing())
        results.append(self.test_workflow_2_content_generation())
        results.append(self.test_workflow_3_data_analysis())
        
        # Summary
        passed = sum(results)
        total = len(results)
        
        print(f"\n📊 Test Results: {passed}/{total} workflows passed")
        
        if passed == total:
            print("🎉 All workflow tests PASSED! FlowsyAI is ready for production!")
        else:
            print("⚠️ Some workflow tests failed. Check implementation.")
        
        return passed == total

if __name__ == "__main__":
    tester = WorkflowTester()
    tester.run_all_tests()
