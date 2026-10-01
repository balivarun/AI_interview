package com.interviewai.service;

public record CodeExecutionResult(
	boolean succeeded,
	String status,
	String output,
	String errorOutput,
	String compileOutput,
	String compileError) {
}