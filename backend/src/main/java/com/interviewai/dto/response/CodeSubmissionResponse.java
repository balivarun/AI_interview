package com.interviewai.dto.response;

public record CodeSubmissionResponse(
	boolean ok,
	boolean succeeded,
	String status,
	String output,
	String errorOutput,
	String compileOutput,
	String compileError) {
}